// VORA Roblox API Proxy Server (Node.js + Express)
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

// Convert username to userId
app.post('/roblox/userId', async (req, res) => {
  const { username } = req.body;
  try {
    const response = await axios.post('https://users.roblox.com/v1/usernames/users', {
      usernames: [username],
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    const user = response.data.data[0];
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch userId', details: error.message });
  }
});

// Get friends list
app.get('/roblox/:userId/friends', async (req, res) => {
  try {
    const response = await axios.get(`https://friends.roblox.com/v1/users/${req.params.userId}/friends`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch friends' });
  }
});

// Get groups
app.get('/roblox/:userId/groups', async (req, res) => {
  try {
    const response = await axios.get(`https://groups.roblox.com/v2/users/${req.params.userId}/groups/roles`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

app.get('/', (req, res) => {
  res.send('✅ VORA Roblox API Proxy is running');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy running on http://localhost:${port}`);
});
