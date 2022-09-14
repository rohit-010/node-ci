const Page = require('./helpers/page');
  
let page;

beforeEach(async () => {
  page = await Page.build();
  await page.login();
  await page.click('a.btn-floating.btn-large.red');
});

afterEach(async () => {
  await page.close();
});

describe('When logged in', () => {


  test('can see Blog create form', async() => {
    
    const label = await page.getContentsOf('form label');
    expect(label).toEqual('Blog Title');

  });

  describe('And using invalid inputs', async() => {
    beforeEach(async() => {
      await page.click('form button');
    });
    test('the form shows an error message', async() => {
      const titleErr = await page.getContentsOf('.title .red-text');
      const contentErr = await page.getContentsOf('.content .red-text');

      expect(titleErr).toEqual('You must provide a value');
      expect(contentErr).toEqual('You must provide a value');
    });
  });

  describe('Using valid inputs', async() => {
    beforeEach(async() => {
      await page.type('.title input','My Test Title')
      await page.type('.content input','My test content lorem ipsum');
      await page.click('form button');

    });

    test('Submitting takes user to a review screen', async() => {
      const confirmation = await page.getContentsOf('form h5');
      expect(confirmation).toEqual('Please confirm your entries');
    });
    test('Submitting then saving adds blog to index page', async() => {
      await page.click('button.green');
      await page.waitFor('.card');
      const title = await page.getContentsOf('.card-title');
      const content = await page.getContentsOf('p');
      expect(title).toEqual('My Test Title');
      expect(content).toEqual('My test content lorem ipsum');
    });
  });

});

describe('User is not logged in ', async() => {

  const actions = [
    {
      method: 'get',
      path: '/api/blogs',
    },
    {
      method: 'post',
      path: '/api/blogs',
      data: {title: 'My title', content: 'My content'}
    }
  ];
  test('User cannot create blog post via api', async() => {

    const result = await page.post('/api.blogs', {title: 'My title',content: 'My content'});
    expect(result).toEqual({ error: 'You must log in!' });

  });

  test('User cannot see list of blogs', async() => {
    const result = await page.get('/api/blogs');

    
    expect(result).toEqual({ error: 'You must log in!' });

  });

  test('Blog related operations are prohibited', async() => {
    const results = await page.execRequests(actions);

    for (const result of results) {
      expect(result).toEqual({ error: 'You must log in!' });
    }
  });
});
