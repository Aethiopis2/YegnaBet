import { useEffect, useState } from 'react'
import * as signalR from '@microsoft/signalr'
import { API } from '../services/api';

const BrokerDashboardPage = () => {
    const [items, setItems] = useState<any[]>([]);
    const [counts, setCounts] = useState<any>({
        new: 0, 
        called: 0, 
        visited: 0,
        negotiating: 0,
        completed: 0
    });

    async function load() {
        const [itemsRes, countsRes] = await Promise.all([ 
            API.get('/inquiries'),
            API.get('/inquiries/counts') ]);
            
            setItems(itemsRes.data);
            setCounts(countsRes.data);
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>New: {counts.new}</div>
                <div>Called: {counts.called}</div>
                <div>Visited: {counts.visited}</div>
                <div>Negotiating: {counts.negotiating}</div>
                <div>Completed: {counts.completed}</div>
            </div>

            {items.map(i => (
                <div key={i.id} style={{border: `1px solid #ddd`, marginBottom: 12, padding: 12}}>
                    <h4>{i.listingTitle}</h4>
                    <div>{i.customerName}</div>
                    <div>{i.customerPhone}</div>
                    <div>Status: {i.status}</div>

                    <button onClick={() => changeStatus(i.id, 'Called')}>Called</button>
                    <button onClick={() => changeStatus(i.id, 'Visited')}>Visited</button>
                    <button onClick={() => changeStatus(i.id, 'Negotiating')}>Negotiating</button>
                    <button onClick={() => changeStatus(i.id, 'Completed')}>Completed</button>

                    <button onClick={async () => {
                        const value = prompt('Deal value (ETB)');
                        if (!value)
                            return;
                        
                        await API.post(`/inquiries/${i.id}/complete`, {
                            dealValue: Number(value),
                            commissionRate: 5
                        });
                        
                        load();
                    }} >
                        Complete Deal
                    </button>
                </div>
            ))}
        </div>
    )
}

export default BrokerDashboardPage