import http from 'k6/http';
import { check, sleep } from 'k6';

const url = "https://quote.development.tradecrit.com";
const projectId = 3698594;
const testName = "Quote Health Check";

export const options = {
    systemTags: ['test-type:load', "service:quote", "environment:development", "team:engineering", "test:health-check"],
    duration: '30s',
    vus: 10,
    cloud: {
        projectId: projectId,
        name: testName
    }
}

export default function () {
    const res = http.get(url);
    check(res, { 'status was 200': (r) => r.status === 200 });
    sleep(1);
}