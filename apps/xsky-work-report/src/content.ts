import { HolidayResponse } from './type/holiday';

console.log('content script');

function insertScript() {
  const e = document.createElement('script');
  e.setAttribute('type', 'text/javascript'),
    e.setAttribute('src', chrome.runtime.getURL('dist/index.js')),
    document.documentElement.appendChild(e);
}

insertScript();

const e = document.querySelector(
  '.form-submit-wrapper button',
) as HTMLButtonElement;
if (e) {
  e.style.display = 'none';
}

const api = 'https://timor.tech/api/holiday/batch';

async function test() {
  const result = await fetch(`${api}?d=2024-02-18&type=Y`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());

  console.log('timor', result);
}

test();

window.addEventListener(
  'message',
  async (event) => {
    // We only accept messages from ourselves
    if (event.source !== window) {
      return;
    }

    if (event.data.type && event.data.type === 'GET_WORKDAY') {
      const dates: string[] = event.data.dates;

      const d = dates
        .map((date) => {
          return `d=${date}`;
        })
        .join('&');

      const resp = await fetch(`${api}?${d}&type=Y`, {
        mode: 'cors',
      });

      const data: HolidayResponse = await resp.json();

      if (data.code === 0) {
        window.postMessage({
          type: 'RETURN_WORKDAY',
          data: data,
        });
      } else {
        alert('获取节假日信息失败');
      }
    }
  },
  false,
);
