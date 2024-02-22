import fs from 'fs';
import path from 'path';
export async function GET(request: Request) {
  const logEntry = `${new Date().toISOString()}, ${request.headers.get(
    'x-forwarded-for'
  )}\n`;

  fs.appendFile(path.join(__dirname, 'downloads.log'), logEntry, (err) => {
    if (err) {
      console.error('记录下载事件时发生错误:', err);
    }
  });
  return Response.json({
    code: 200,
  });
}
