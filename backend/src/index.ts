import { config } from 'dotenv'
import express, { Request, Response } from 'express'

config()

const PORT = process.env.PORT || 3001

const app = express()

app.get('/testing', (req: Request, res: Response) => {
    res.send('YES')
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))