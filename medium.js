import http from 'k6/http';
import { check,group } from 'k6';

export const options = {
    insecureSkipTLSVerify: true,
    tlsVersion: {
        min: 'tls1.2',
        max: 'tls1.3',
    },
    thresholds: {
        'http_req_duration{type:get}': ['p(95)<200'],
        'http_req_duration{type:head}': ['p(95)<200'], 
        'http_req_duration{type:delete}': ['p(95)<200'],
        'http_req_duration{type:post}': ['p(95)<200'], 
        'http_req_duration{type:put}': ['p(95)<200'],
    },
    scenarios: {
        constant_request_rate: {
          executor: 'constant-arrival-rate',
          rate: 1000,
          timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
          duration: '600s',
          preAllocatedVUs: 100, // how large the initial pool of VUs would be
          maxVUs: 100, // if the preAllocatedVUs are not enough, we can initialize more
        },
      },
};

const KONG_HOST_NAME = "52.43.134.51" 

export default function () {

    check(http.get(`https://${KONG_HOST_NAME}/medium/get/foo.json`,{tags: { type: 'get' }}),{'get': (r) => r.status === 200});
    check(http.head(`https://${KONG_HOST_NAME}/medium/head/bar.json`,{tags: { type: 'head' }}),{'head': (r) => r.status === 200});
    check(http.del(`https://${KONG_HOST_NAME}/medium/delete/yyy.json`,{tags: { type: 'delete' }}),{'delete': (r) => r.status === 200});
    check(http.post(`https://${KONG_HOST_NAME}/medium/post/xxx.json`,JSON.stringify({
        method: 'POST',
        data: 'this is some random data',
      }),{tags: { type: 'post' }}),{'post': (r) => r.status === 200});
    check(http.put(`https://${KONG_HOST_NAME}/medium/put/zzz.json`,JSON.stringify({
        method: 'PUT',
        data: 'this is some random data',
      }),{tags: { type: 'put' }}),{'put': (r) => r.status === 200});

}