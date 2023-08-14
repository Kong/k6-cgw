import http from 'k6/http';
import { check,group } from 'k6';

export const options = {
    insecureSkipTLSVerify: true,
    tlsVersion: {
        min: 'tls1.2',
        max: 'tls1.3',
    },
    thresholds: {
        'http_req_duration{type:200}': ['p(95)<500'],
        'http_req_duration{type:404}': ['p(95)<200'], 
      },
};

const KONG_HOST_NAME = "ec2-35-87-94-127.us-west-2.compute.amazonaws.com" 

export default function () {


    check(http.get(`https://${KONG_HOST_NAME}/200`,{tags: { type: '200' }}),{'is 200': (r) => r.status === 404});
    check(http.get(`https://${KONG_HOST_NAME}/404`,{tags: { type: '404' }}),{'is 404': (r) => r.status === 404});
    
    // check(http.get(`https://${KONG_HOST_NAME}/503`),{'is 503': (r) => r.status === 503});
    // check(http.get(`https://${KONG_HOST_NAME}/index.html`),{'index.html exists': (r) => r.status === 200});
    // group("small", function () {
    //     check(http.get(`https://${KONG_HOST_NAME}/small.json`),{'small.json exists': (r) => r.status === 200});
    // });
    // group("medium", function () {
    //     check(http.get(`https://${KONG_HOST_NAME}/medium.jpg`),{'medium.jpg exists': (r) => r.status === 200});
    // });
    // group("large", function () {
    //     check(http.get(`https://${KONG_HOST_NAME}/large.png`),{'large.png exists': (r) => r.status === 200});
    // });

    
}