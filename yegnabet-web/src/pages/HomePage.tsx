import React, { useEffect, useState } from 'react'
import { API } from '../services/api';
import ListingCard from '../components/ListingCard';

const HomePage = () => {
    const [listings, setListings] = useState<any[]>([]);

    useEffect(() => {
        API.get('/listings').then(r => setListings(r.data));
    }, []);

    return (
        <div style={{ maxWidth: 420, margin: '0 auto', padding: 16 }}>
            <h1>Yegna Bet</h1>

            {listings.map(l => (
                <ListingCard
                key={l.id}
                title={l.title}
                area={l.area}
                price={l.price}
                priceUnit={l.priceUnit}
                trustScore={l.trustScore}
                verified={l.isVerified}
                />
            ))}
        </div>
    );
}

export default HomePage