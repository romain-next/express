const express = require('express')
const { connectDB, sequelizeInstance } = require("./db")
const app = express()

app.use(express.json());

const user = require("./model/user")

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Mon API DevOps' })
})

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.get('/users', async (req, res) => {
  const users = await user.findAll();
  res.status(200).json({ status: 'ok', data:users })
})

app.get('/users/:id', async (req, res) => {
  const userId = req.params.id
  const oneUser = await user.findOne({where: {id: userId}});
  if(!oneUser){
    return res.status(404).json({status:"not found"})
  }
  res.status(200).json({ status: 'ok', data:oneUser })
})

app.post('/users', async (req, res) => {
  const body = req.body
  if(!body.name || !body.firstName || !body.email){
    return res.status(400).json({status: "error", message:"Champ manquant"})
  }
  const {firstName, email, name} = body
  const userCreated = await user.create({firstName,email,name });
  res.status(201).json({ status: 'ok', data:userCreated })
})

app.put('/users/:id', async (req, res) => {
  const userId = req.params.id
  const oneUser = await user.findOne({where: {id: userId}});
  if(!oneUser){
    return res.status(404).json({status:"not found"})
  }
  const body = req.body
  if(!body){
    return res.status(400).json({status:"error"})
  }
  const userUpdated = await oneUser.update(body);
  res.status(200).json({ status: 'ok', data:userUpdated })
})

app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id
  const oneUser = await user.findOne({where: {id: userId}});
  if(!oneUser){
    return res.status(404).json({status:"not found"})
  }
  const userDeleted = await oneUser.destroy();
  res.status(200).json({ status: 'ok', data:userDeleted })
})

if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    sequelizeInstance.sync();
    app.listen(PORT, () =>
      console.log(`Serveur démarré sur http://localhost:${PORT}`),
    );
  });
}


module.exports = app