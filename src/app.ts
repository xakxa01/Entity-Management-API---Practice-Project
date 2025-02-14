import { config } from 'dotenv'
import express from 'express';
import morgan from 'morgan'
import cors from 'cors'
import entitiesRoutes from './routes/entities.routes.ts'

config()

const app = express();

// config
const port = process.env.PORT || 3000;

// middleware
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

// route
app.use('/api/entities', entitiesRoutes)

app.listen(port);
console.log(`Server is running on http://localhost:${port}`);