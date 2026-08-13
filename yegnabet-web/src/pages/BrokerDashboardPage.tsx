import { useEffect, useState } from 'react'
import * as signalR from '@microsoft/signalr'
import { API } from '../services/api';

const BrokerDashboardPage = () => {
    const [items, setItems] = useState<any[]>([]);

    async function load() {
        const r = await API.get('/inquiries');
        setItems(r.data);
    }

    useEffect(() => {
        load();

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5150/hubs/broker", {
                transport: signalR.HttpTransportType.LongPolling
            })
            .withAutomaticReconnect()
            .build();

        connection.on('InquiryCreated', () => load());
        connection.on('InquiryUpdated', () => load());

        connection.start()
            .then(() => console.log('SignalR connected'))
            .catch(err => console.error('SignalR failed', err));

        return () => {
             connection.stop();
        }
    }, []);

    async function changeStatus(id: number, status: string) {
        await API.put(`/inquiries/${id}/status`, {status});
    }

    return (
        <div style={{padding: 16}}>
            <h1>Broker Dashboard</h1>

            {items.map(i => (
                <div key={i.id} style={{border: `1px solid #ddd`, marginBottom: 12, padding: 12}}>
                    <h4>{i.listingTitle}</h4>
                    <div>{i.customerName}</div>
                    <div>{i.customerPhone}</div>
                    <div>Status: {i.status}</div>

                    <button onClick={() => changeStatus(i.id, 'Called')}>Called</button>
                    <button onClick={() => changeStatus(i.id, 'Visited')}>Visited</button>
                    <button onClick={() => changeStatus(i.id, 'Negotiatied')}>Negotiatied</button>
                    <button onClick={() => changeStatus(i.id, 'Completed')}>Completed</button>
                </div>
            ))}
        </div>
    )
}

export default BrokerDashboardPage