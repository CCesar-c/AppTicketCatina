import express from 'express';

const app = express();

app.use(express.json());

app.post("/receber", (req) =>{

})

// enviar 
app.get('/', (res) => {
    res.send("Permitame gozar")
})