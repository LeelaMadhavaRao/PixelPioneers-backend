import cors from 'cors';
import express from 'express';
import { connectToDB ,db} from "./db.js";

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.json( "server is running successfully!");
})
 
app.post('/signin', async(req, res) => {
    await db.collection("users").findOne({email:req.body.email})
    .then((result)=>{
        if(result?.password===req.body.password){
            res.json({message:"login sucess", values:result})
        } else {
            res.json({error:"user not found"})
        }
    })
    .catch((e)=>console.log(e))
})
app.post('/signup', async (req, res) => {
    try {
        const result = await db.collection("users").findOne({ email: req.body.email });

        if (result) {
            return res.json({ message: "user already Exists", values: result });
        } else {
            const output = await db.collection("users").insertOne({
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
                phone: req.body.phone
            });

            return res.json({ message: "account created", values: output });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.post('/item/:itemname', async (req, res) => {
    const {itemname}=req.params
    try {
        const data = await db.collection(itemname).find({}).toArray();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data', error);
        
    }
});

app.post('/filter/:keyword', async (req, res) => {
    const { keyword } = req.params;
    
    try {
        const data = await db.collection('Products').find({ KeyWords:{$all:[keyword]}}).toArray();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.post('/seller/:itemname', async (req, res) => { //Update This a/c New Db 
    const { itemname } = req.params;
    try {
        const result = await db.collection(itemname).insertOne(req.body);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Internal Server Error' }); 
    }
});

app.post('/sellerRequest', async (req, res) => {
    try {
        const result = await db.collection("sellers").insertOne(req.body);
        if (result.insertedId) {
            res.status(201).json({ message: 'Seller added successfully', sellerId: result.insertedId });
        } else {
            res.status(400).json({ error: 'Failed to add seller' });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/getSellerStatus/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID is required'+id });
        }
        const seller = await db.collection('sellers').findOne({ id });
        if (!seller) {
            return res.status(404).json({ error: 'Seller not found' });
        }
        res.json(seller.Status);

    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/admin', async (req, res) => {
    try {
        const usersData = await db.collection('users').find({}).toArray();
        const sellersData = await db.collection('sellers').find({}).toArray();

        res.json({
            users: usersData,
            sellers: sellersData,
        });
    } catch (error) {
        console.error('Error fetching data', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/adminAccept/:id/:status', async (req, res) => {
    const {id, status} = req.params
    try {
        const data = await db.collection("sellers").updateOne({id},{$set:{Status:status}});
        res.json(id);
    } catch (error) {
        console.error('Error fetching data', error);
        
    }
});

app.post('/addcart', async (req,res)=>{
    try {
        const result = await db.collection("user-cart").insertOne(req.body);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Internal Server Error' }); 
    }
})
app.post('/cart', async (req,res)=>{
    try {
        const data = await db.collection("user-cart").find({}).toArray();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data', error);
        
    }
})

app.post('/addorder', async (req,res)=>{
    try {
        const result = await db.collection("user-order").insertOne(req.body);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Internal Server Error' }); 
    }
})
app.post('/order', async (req,res)=>{
    try {
        const data = await db.collection("user-order").find({}).toArray();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data', error);
        
    }
})



connectToDB(() => {
    app.listen(9000, () => {
        console.log("server running at 9000");
    })
})




