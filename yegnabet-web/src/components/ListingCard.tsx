type Props = {
    title: string;
    area: string;
    price?: number;
    priceUnit?: string;
    trustScore: number;
    verified: boolean;
};

const ListingCard = (props: Props) => {
  return (
    <div style={{
        border: '1px solid #ddd',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12
    }}>
        <h3>{props.title}</h3>
        <p>
            {props.area}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between'}}>
            <strong>
                {props.price?.toLocaleString()} ETB/{props.priceUnit}
            </strong>

            <span>{props.trustScore}%</span>
        </div>

        {props.verified && <div>✔ Verified</div>}
    </div>
  )
}

export default ListingCard