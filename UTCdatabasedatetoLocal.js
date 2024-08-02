const fetchdata = async () => {
    try {
        const response = await fetch('http://localhost:4000/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'kevin@gmail.com',
                password: '123456'
            })
        });
        const data = await response.json();
        console.log(data);

        // Assuming 'data.createdAt' is in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
        const createduser = new Date(data.user.createdAt);

        // Use a fallback locale if necessary
        const localDate = createduser.toLocaleString('en-US', {
            dateStyle: 'full', // Choose desired formatting options
            timeStyle: 'short'
        });

        console.log("Order Date (local):", localDate);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

fetchdata();