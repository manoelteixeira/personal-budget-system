# Personal Budget

>  A simple personal budget control api using the envelope system.

## Table of Contents
- [Description](#description)
- [How To Use](#how-to-use)
- [License](#license)
- [Author Info](#author-info)


***
## **Description**

> This API implements a simple personal budget system using the [Envelope Method](https://www.thebalance.com/what-is-envelope-budgeting-1293682).  You can divide your monthly expenses into categories and assign each category to an envelope. When the budget for each envelope is spent you can no longer spend money in that category unless you transfer funds from another envelope.

## **How To Use**

- Use `npm install` to install all the dependencies required.
- `node app.js` to run the application.

### Features:
- Get all envelopes
    > GET /envelopes
- Get especific envelope
    > GET /envelopes/:id
- Add envelope
    > POST /envelopes
    ~~~json
    {
        "label": "<Envelope_Label>",
        "value": <Envelope_Value>
    }
    ~~~
- Update envelope
    > POST /envelope/update/:id
    ~~~json
    {
        "value": <New_Value>
    }
    ~~~
- Transfer funds between envelope
    > POST /envelopes/transfer/:from/:to
    ~~~json
    {
        "value": <Value_to_be_Transfered>
    }
    ~~~
- Delete envelope
    > DELETE /envelopes/:id


## **License**

MIT License

Copyright (c) [2021] [Manoel Teixeira]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## **Author Info**

- Twitter - [@manowhell](https://twitter.com/Manowhell/)
- Linkedin - [Manoel Alves Teixeira](https://www.linkedin.com/in/manoel-alves-teixeira/)
