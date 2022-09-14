const Page = require('./helpers/page');
  
let page;

describe('Login Page', () => {
  beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
  });

  afterEach(async () => {
    await page.close();
  });

  test('Header has correct text', async () => {
    const text =  await page.getContentsOf('a.brand-logo');
    expect(text).toEqual('Blogster');
  });

  test('click login button for oauth flow', async () => {
    
    await page.click('ul.right a');
    const url = await page.url();
    
    expect(url).toMatch(`/accounts\.google\.com/`);
  });

  test('When signed in shows logout button', async() => {
    await page.login();
    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
    expect(text).toEqual('Logout');
  });

});