import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import axios from "axios"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const email = process.env.OFFICIAL_EMAIL

app.get("/health", (req, res) => {
    res.status(200).json({
        is_success: true,
        official_email: email
    })
})

app.post("/bfhl", async (req, res) => {
    try {
        const body = req.body
        const keys = Object.keys(body)

        if (keys.length !== 1) {
            return res.status(400).json({
                is_success: false,
                official_email: email
            })
        }

        const key = keys[0]

        if (key === "fibonacci") {
            const n = body.fibonacci
            if (!Number.isInteger(n) || n < 0) {
                return res.status(400).json({
                    is_success: false,
                    official_email: email
                })
            }

            let a = 0
            let b = 1
            const result = []

            for (let i = 0; i < n; i++) {
                result.push(a)
                const c = a + b
                a = b
                b = c
            }

            return res.status(200).json({
                is_success: true,
                official_email: email,
                data: result
            })
        }

        if (key === "prime") {
            const arr = body.prime
            if (!Array.isArray(arr)) {
                return res.status(400).json({
                    is_success: false,
                    official_email: email
                })
            }

            const result = []

            for (let i = 0; i < arr.length; i++) {
                const x = arr[i]
                if (x < 2) continue

                let isPrime = true
                for (let j = 2; j * j <= x; j++) {
                    if (x % j === 0) {
                        isPrime = false
                        break
                    }
                }

                if (isPrime) result.push(x)
            }

            return res.status(200).json({
                is_success: true,
                official_email: email,
                data: result
            })
        }

        if (key === "lcm") {
            const arr = body.lcm
            if (!Array.isArray(arr) || arr.length === 0) {
                return res.status(400).json({
                    is_success: false,
                    official_email: email
                })
            }

            const gcd = (a, b) => {
                while (b !== 0) {
                    const t = b
                    b = a % b
                    a = t
                }
                return a
            }

            let ans = arr[0]
            for (let i = 1; i < arr.length; i++) {
                ans = (ans * arr[i]) / gcd(ans, arr[i])
            }

            return res.status(200).json({
                is_success: true,
                official_email: email,
                data: ans
            })
        }

        if (key === "hcf") {
            const arr = body.hcf
            if (!Array.isArray(arr) || arr.length === 0) {
                return res.status(400).json({
                    is_success: false,
                    official_email: email
                })
            }

            const gcd = (a, b) => {
                while (b !== 0) {
                    const t = b
                    b = a % b
                    a = t
                }
                return a
            }

            let ans = arr[0]
            for (let i = 1; i < arr.length; i++) {
                ans = gcd(ans, arr[i])
            }

            return res.status(200).json({
                is_success: true,
                official_email: email,
                data: ans
            })
        }

        if (key === "AI") {
            const question = body.AI

            if (typeof question !== "string" || question.trim().length === 0) {
                return res.status(400).json({
                    is_success: false,
                    official_email: email
                })
            }

            try {
                const response = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
                    {
                        contents: [
                            {
                                parts: [
                                    {
                                        text: `Answer in exactly one word only. No punctuation. No explanation.\n\nQuestion: ${question}`
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        headers: { "Content-Type": "application/json" },
                        timeout: 8000
                    }
                )

                const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text
                if (text) {
                    const answer = text.trim().split(/\s+/)[0]
                    return res.status(200).json({
                        is_success: true,
                        official_email: email,
                        data: answer
                    })
                }

                return res.status(200).json({
                    is_success: true,
                    official_email: email,
                    data: "Unavailable"
                })
            } catch {
                return res.status(200).json({
                    is_success: true,
                    official_email: email,
                    data: "Unavailable"
                })
            }
        }

        return res.status(400).json({
            is_success: false,
            official_email: email
        })
    } catch {
        return res.status(500).json({
            is_success: false,
            official_email: email
        })
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT)
