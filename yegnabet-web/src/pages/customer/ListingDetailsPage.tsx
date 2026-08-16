import React, { useEffect, useState } from 'react'
import { API } from '../../services/api';


const ListingDetailsPage = () => {
  const [listing, setListing] = useState<any>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const id = 1;     // temp

  useEffect(() => {
    API.get(`/listings/${id}`).then(r => setListing(r.data));
  }, []);

  async function requestCall() {
    await API.post(`/inquiries`, {
        listingId: id,
        customerName: name,
        customerPhone: phone
    });

    alert('Request sent to Broker');
  }

  if (!listing)
    return <div>Loading ...</div>

  return (
    <div style={{padding: 16, maxWidth: 420, margin: `0 auto`}}>
        <h2>{listing.title}</h2>
        <p>{listing.description}</p>

        <input type="text" 
            placeholder='Your name...' 
            value={name} 
            onChange={e => setName(e.target.value)} 
        />

        <input type="text" 
            placeholder='Phone Number...' 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
        />

        <button onClick={requestCall}>
            Request Broker Call
        </button>
    </div>
  );
}

export default ListingDetailsPage