/*
 Project-Name: Cloudflare DB
 Author: Tuhin Kanti Pal
 Author's Github: https://github.com/cachecleanerjeet
 Author's Email: me@thetuhin.com
 LICENSE: Apache-2.0 
 Note for Kangers: Changing author's name will not make you a developer
 Contact: https://telegram.dog/t_projects
 Channel: https://telegram.dog/tprojects
*/

const POSTKEY = null; // "your-key" to secure POST requests with a token
const DELETEKEY = null; // "your-key" to secure DELETE requests with a token

async function handleRequest(request) {

    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
        "Access-Control-Max-Age": "86400",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Your-IP": request.headers.get("cf-connecting-ip"),
        "Your-Country": request.headers.get("CF-IPCountry"),
        "Host": request.headers.get("host"),
        "Made-By": atob('VHVoaW4gS2FudGkgUGFsLCBodHRwczovL2dpdGh1Yi5jb20vY2FjaGVjbGVhbmVyamVldA==')
    }

    if (request.method == "OPTIONS") { // Handel Preflight Requests
        return new Response(null, {
            status: 200,
            headers
        })

    } else if (request.method == "POST") { // Insert a JSON Payload
        if (new URL(request.url).searchParams.get('key') !== POSTKEY && POSTKEY !== null) {
            return new Response(JSON.stringify({
                status: false,
                msg: "Unauthorized"
            }), {
                status: 401,
                headers
            })
        } else {
            var setpayload = await request.json()
            if (setpayload._id == undefined) {
                var keyid = (await (await fetch('https://time.akamai.com/')).text()) + Math.random().toString(36).substring(9)
            } else {
                var keyid = setpayload._id
            }
            await TUHIN.put(keyid, JSON.stringify(setpayload))
            return new Response(JSON.stringify({
                status: true,
                _id: keyid,
                query: `https://${request.headers.get("host")}/${keyid}`,
                data: setpayload
            }), {
                status: 200,
                headers
            })
        }
    } else if (request.method == "GET") { // Get a JSON Data
        var path = new URL(request.url).pathname
        if (path == "/") {
            return new Response(JSON.stringify({
                status: "Running"
            }), {
                status: 200,
                headers
            })
        } else {
            var keyid = path.replace('/', '')
            var getpayload = await TUHIN.get(keyid)
            if (getpayload == null) {
                return new Response(JSON.stringify({
                    status: false,
                    message: "Not Found"
                }), {
                    status: 200,
                    headers
                })
            } else {
                return new Response(JSON.stringify({
                    status: true,
                    _id: keyid,
                    data: JSON.parse(getpayload)
                }), {
                    status: 200,
                    headers
                })
            }
        }
    } else if (request.method == "DELETE") { // Delete a Document
        if (new URL(request.url).searchParams.get('key') !== DELETEKEY && DELETEKEY !== null) {
            return new Response(JSON.stringify({
                status: false,
                msg: "Unauthorized"
            }), {
                status: 401,
                headers
            })
        } else {
            var path = new URL(request.url).pathname;
            if (path == '/') {
                return new Response(JSON.stringify({
                    status: false,
                    message: "Can't Delete /"
                }), {
                    status: 500,
                    headers
                })
            } else {
                await TUHIN.delete(path.replace('/', ''))
                return new Response(JSON.stringify({
                    status: true,
                    msg: "Deleted Successfully"
                }), {
                    status: 200,
                    headers
                })
            }
        }
    } else {
        return new Response(JSON.stringify({
            status: false,
            message: "Only supports GET, POST, DELETE, OPTIONS"
        }), {
            status: 500,
            headers
        })
    }
}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

/*
 Project-Name: Cloudflare DB
 Author: Tuhin Kanti Pal
 Author's Github: https://github.com/cachecleanerjeet
 Author's Email: me@thetuhin.com
 LICENSE: Apache-2.0
 Note for Kangers: Changing author's name will not make you a developer
 Contact: https://telegram.dog/t_projects
 Channel: https://telegram.dog/tprojects
*/
