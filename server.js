const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@libsql/client');
const cors = require('cors');

const app = express();
const port = 5000;

const client = createClient({
    url: 'libsql://first-db-lohith114.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MzMxNzE2NzMsImlkIjoiMThjZjQ3YjItYmY0My00NmY4LWI0NjItMjRjMzViMjMxNTU1In0.gtrlT1IoprMHxnTs8Ygr8qzWxHjkBPChpMslXhJlGP6jiCLxr7_zJNNED-VjstowzDIvGfZhBhFGa-FB1RXYDg',
});

app.use(bodyParser.json());
app.use(cors());

app.post('/login', async (req, res) => {
    const { rollNumber, password } = req.body;
    console.log('Received roll number:', rollNumber);

    try {
        const query = `SELECT * FROM "Student-info" WHERE "rollNumber" = ?`;
        const params = [rollNumber];

        console.log('Executing query:', query);
        console.log('With parameters:', params);

        const result = await client.execute(query, params);

        console.log('Query result:', result);

        if (result.rows.length === 0) {
            return res.status(404).send({ error: 'Student not found' });
        }

        const student = result.rows[0];

        if (password !== student["parentContact"]) {
            return res.status(401).send({ error: 'Incorrect password' });
        }

        const { password: _, ...studentData } = student;
        res.status(200).json(studentData);

    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
