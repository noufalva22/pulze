import React, { useEffect, useState } from 'react';

function DelhiveryIntegration() {
  const [accessToken, setAccessToken] = useState('');

  // Delhivery API credentials
  const clientId = '40128b';
  const clientSecret = '206a3d4b79204b8a83c94be5972dbc16fc2f41a0';
  const username = 'noufalva@outlook.com';
  const password = '#Naufalva12';

  // Authentication endpoint
  const authUrl = 'https://track.delhivery.com/api/auth/v1/custlogin';

  // API endpoint
  const apiUrl = 'https://track.delhivery.com/api/p/edit';

  useEffect(() => {
    authenticate();
  }, []);

  const authenticate = async () => {
    try {
      const authPayload = {
        client_id: clientId,
        client_secret: clientSecret,
        username: username,
        password: password,
      };

      const response = await fetch(authUrl, {
        method: 'POST',
        body: JSON.stringify(authPayload),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      const token = data.access_token;
      setAccessToken(token);
    } catch (error) {
      console.error('Authentication failed', error);
    }
  };

  const createDelhiveryShipment = async () => {
    try {
      const shipmentPayload = {
        waybill: 'YOUR_WAYBILL_NUMBER',
        products: [
          {
            name: 'Product 1',
            quantity: 2,
            price: 10,
          },
          {
            name: 'Product 2',
            quantity: 1,
            price: 20,
          },
        ],
        order: {
          orderid: 'YOUR_ORDER_ID',
          orderdate: 'YYYY-MM-DD',
          paymentmode: 'Prepaid',
        },
        pickup_location: {
          name: 'Pickup Location',
          phone: '1234567890',
          pin: '123456',
          address: 'Pickup Address',
        },
        delivery_address: {
          name: 'Delivery Location',
          phone: '9876543210',
          pin: '654321',
          address: 'Delivery Address',
        },
        seller_name: 'Your Company',
        seller_address: 'Your Company Address',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(shipmentPayload),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Failed to create Delhivery shipment', error);
    }
  };

  return (
    <div>
      <button onClick={createDelhiveryShipment}>Create Shipment</button>
    </div>
  );
}

export default DelhiveryIntegration;