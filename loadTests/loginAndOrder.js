import jsonpath from 'https://jslib.k6.io/jsonpath/1.0.2/index.js'
import { check, fail, group, sleep } from 'k6'
import http from 'k6/http'

export const options = {
    cloud: {
        distribution: { 'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 } },
        apm: [],
    },
    thresholds: {},
    scenarios: {
        Scenario_1: {
            executor: 'ramping-vus',
            gracefulStop: '30s',
            stages: [
                { target: 5, duration: '30s' },
                { target: 15, duration: '1m' },
                { target: 10, duration: '30s' },
                { target: 0, duration: '30s' },
            ],
            gracefulRampDown: '30s',
            exec: 'scenario_1',
        },
    },
}

export function scenario_1()
{
    let response

    const vars = {}

    group('page_2 - https://pizza.max-gollaher.click/login', function ()
    {
        response = http.put(
            'https://pizza-service.max-gollaher.click/api/auth',
            '{"email":"a@jwt.com","password":"admin"}',
            {
                headers: {
                    'content-type': 'application/json',
                    dnt: '1',
                    'sec-ch-ua': '"Chromium";v="131", "Not_A Brand";v="24"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                },
            }
        )
        if (!check(response, { 'status equals 200': response => response.status.toString() === '200' }))
        {
            console.log(response.body);
            fail('Login was *not* 200');
        }

        vars['token'] = jsonpath.query(response.json(), '$.token')[0]

        sleep(1)
    })

    group('page_4 - https://pizza.max-gollaher.click/menu', function ()
    {
        response = http.get('https://pizza-service.max-gollaher.click/api/order/menu', {
            headers: {
                authorization: `Bearer ${vars['token']}`,
                'content-type': 'application/json',
                dnt: '1',
                'sec-ch-ua': '"Chromium";v="131", "Not_A Brand";v="24"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
            },
        })
        response = http.get('https://pizza-service.max-gollaher.click/api/franchise', {
            headers: {
                authorization: `Bearer ${vars['token']}`,
                'content-type': 'application/json',
                dnt: '1',
                'sec-ch-ua': '"Chromium";v="131", "Not_A Brand";v="24"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
            },
        })
        sleep(1)
    })

    group('page_5 - https://pizza.max-gollaher.click/payment', function ()
    {
        response = http.post(
            'https://pizza-service.max-gollaher.click/api/order',
            '{"items":[{"menuId":1,"description":"Veggie","price":0.0038}],"storeId":"1","franchiseId":1}',
            {
                headers: {
                    authorization: `Bearer ${vars['token']}`,
                    'content-type': 'application/json',
                    dnt: '1',
                    'sec-ch-ua': '"Chromium";v="131", "Not_A Brand";v="24"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                },
            }
        )
        if (!check(response, { 'status equals 200': response => response.status.toString() === '200' }))
        {
            console.log(response.body);
            fail('Login was *not* 200');
        }

        vars['jwt1'] = jsonpath.query(response.json(), '$.jwt')[0]

        sleep(1)
    })

    group('page_6 - https://pizza.max-gollaher.click/delivery', function ()
    {
        response = http.post(
            'https://pizza-factory.cs329.click/api/order/verify',
            `{"jwt":"${vars['jwt1']}"}`,
            {
                headers: {
                    authorization: `Bearer ${vars['token']}`,
                    'content-type': 'application/json',
                    dnt: '1',
                    'sec-ch-ua': '"Chromium";v="131", "Not_A Brand";v="24"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                },
            }
        )
        sleep(1)
    })

    group('page_7 - https://pizza.max-gollaher.click/logout', function ()
    {
        response = http.del('https://pizza-service.max-gollaher.click/api/auth', null, {
            headers: {
                authorization: `Bearer ${vars['token']}`,
                'content-type': 'application/json',
                dnt: '1',
                'sec-ch-ua': '"Chromium";v="131", "Not_A Brand";v="24"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
            },
        })
    })
}