import { useEffect, useState } from 'react';
import { API } from '../services/api';
import * as signalR from '@microsoft/signalr'


export default function FinancePage() {
    const [data, setData] = useState<any>(null);
    
    async function load() {
        const r = await API.get('/finance/dashboard');
        setData(r.data);
    }
    
    useEffect(() => {
        load();

        const connection = new signalR.HubConnectionBuilder()
                                .withUrl("http://localhost:5150/hubs/broker", {
                                    transport: signalR.HttpTransportType.LongPolling
                                })
                                .withAutomaticReconnect()
                                .build();
        
        connection.on('FinanceUpdated', load);

        connection.start()
            .then(() => console.log('SignalR connected'))
            .catch(err => console.error('SignalR failed', err));

        return () => {
                connection.stop();
        }
    }, []);
    
    if (!data)
        return <div>Loading...</div>;
    
    return ( 
        <div style={{ padding: 16, maxWidth: 420, margin: '0 auto' }}>
            <h1>Finance</h1>
            <div>Revenue: {data.revenue} ETB</div>
            <div>Expenses: {data.expenses} ETB</div>
            <div>Profit: {data.profit} ETB</div>
            <div>Outstanding: {data.outstanding} ETB</div>
            <div>Deals: {data.dealsCompleted}</div>
        </div>
    );
}