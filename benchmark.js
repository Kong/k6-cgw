import http from 'k6/http';
import { check,group } from 'k6';

export const options = {
    insecureSkipTLSVerify: true,
    tlsVersion: {
        min: 'tls1.2',
        max: 'tls1.3',
    },
    thresholds: {
        'http_req_duration{type:200}': ['p(95)<200'],
        'http_req_duration{type:404}': ['p(95)<200'], 
      },
};

const KONG_HOST_NAME = "kong.kong" 

export default function () {

    check(http.get(`https://${KONG_HOST_NAME}/200`,{tags: { type: '200' }}),{'is 200': (r) => r.status === 200});
    
}