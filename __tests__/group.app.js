import request from 'supertest';
import { httpServer } from '../index.js';
import mongoose from 'mongoose';
import connectDB from '../helper/dbConnection.js';
const db = mongoose.connection;
let usersCollection, groupCollection, messageCollection;
let originalUsers = [];
let originalGroups = [];
// Start the server before running the tests
let session;
let user1;
let user2;
let user3, user4, user5;
beforeAll( async() => {
  await connectDB();
  usersCollection = db.db.collection('users');
  groupCollection = db.db.collection('groups');
  messageCollection = db.db.collection('messages');
  originalUsers =await usersCollection.find({}).toArray();
  await messageCollection.deleteMany({});
  await groupCollection.deleteMany({});
  httpServer.listen(8000, () => {
    console.log('Test server running on port 8080');
  });
});

// Close the server after tests are done
afterAll(async () => {

  await usersCollection.deleteMany({});
  await usersCollection.insertMany(originalUsers);
  await mongoose.connection.close(); 
  await new Promise((resolve) => httpServer.close(resolve));
}, 10000);
beforeEach(async () => {
  // Start a new session for each test
  session = await mongoose.startSession();
  session.startTransaction();
});

afterEach(async () => {
  // Rollback the transaction after each test
  await session.abortTransaction();
  session.endSession();
});
describe('Functional Testing for Group Creation API', () => {
  let token; // To store the JWT token
  let adminToken, user1Token, user2Token, user3Token;
  // Step 1: Login to get the JWT token Admin
  it('should not Allow to login as Admin or User username or password wrong', async () => {
    const res = await request(httpServer)
      .post('/login')
      .send({
        mobile: 9663828072,
        password: "1234"
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBeDefined();

  });
  it('should login as Admin and return JWT token', async () => {
    const res = await request(httpServer)
      .post('/login')
      .send({
        mobile: 9963828072,
        password: "1234"
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Login successfully.');
    expect(res.body.token).toBeDefined(); // Ensure the token is returned

    // Store the token for further use in the next tests
    adminToken = res.body.token;
  });

  // Step 2: Register a user
  it('should register a new user by Admin (user1)', async () => {
    const res = await request(httpServer)
      .post('/register')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        username: "Test User Vinay",
        mobile: "9963828074",
        password: "1234",
        role: "user"
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Record added successfully.');
    user1 = res.body.data._id;
  });
  it('should register a new user by Admin (user2)', async () => {
    const res = await request(httpServer)
      .post('/register')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        username: "Test 2 User Vinay",
        mobile: "9963828075",
        password: "1234",
        role: "user"
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Record added successfully.');
    user2 = res.body.data._id;
  });
  it('should register a new user by Admin (user3)', async () => {
    const res = await request(httpServer)
      .post('/register')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        username: "Test 3 User Vinay",
        mobile: "9963828076",
        password: "1234",
        role: "user"
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Record added successfully.');
    user3 = res.body.data._id;
  });
  it('should register a new user by Admin (user4)', async () => {
    const res = await request(httpServer)
      .post('/register')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        username: "Test 4 User Vinay",
        mobile: "9963828077",
        password: "1234",
        role: "user"
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Record added successfully.');
    user4 = res.body.data._id;
  });
  it('should register a new user by Admin (user5)', async () => {
    const res = await request(httpServer)
      .post('/register')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        username: "Test 5 User Vinay",
        mobile: "9963828078",
        password: "1234",
        role: "user"
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Record added successfully.');
    user5 = res.body.data._id;
  });

  it('should Not register using Existing Mobile Number by Admin', async () => {
    const res = await request(httpServer)
      .post('/register')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        username: "Test 2 User Vinay",
        mobile: "9963828075",
        password: "1234",
        role: "user"
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBeDefined();
  });
  it('should Edit current user details by Admin', async () => {
    const res = await request(httpServer)
      .post('/edit-user')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        user_id:user5,
        username: "Edited User",
        mobile: "9963828080",
        password: "1234",
        role: "user"
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBeDefined();
  });

  it('should not Edit Mobile number Already Exists by Admin', async () => {
    const res = await request(httpServer)
      .post('/edit-user')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        user_id: user3,
        username: "Edited User",
        mobile: "9963828080",
        password: "1234",
        role: "user"
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBeDefined();
  });

  it('should login as User and return JWT token (User1)', async () => {
    const res = await request(httpServer)
      .post('/login')
      .send({
        mobile: 9963828074,
        password: "1234"
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Login successfully.');
    expect(res.body.token).toBeDefined(); // Ensure the token is returned

    // Store the token for further use in the next tests
    user1Token = res.body.token;
  });
  
  it('should not register a new user by User(unAuthorised) (User 1)', async () => {
    const res = await request(httpServer)
      .post('/register')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        username: "Test User Vinay",
        mobile: "9963828074",
        password: "1234",
        role: "user"
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('Unauthorized User.');
  });

  // Create a group using the Bearer token
  let group_id1,group_id2;
  it('should create a group when authenticated By Normal User (user1)', async () => {
    const res = await request(httpServer)
      .post('/create-group')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        groupName: "cricket Lovers"
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Group created successfully.');
    expect(res.body.data).toBeDefined(); // Ensure the group object is returned

    group_id1 = (res.body.data)?._id;
  });
  it('should create a group when authenticated By Normal User (user1)', async () => {
    const res = await request(httpServer)
      .post('/create-group')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        groupName: "cricket 4"
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Group created successfully.');
    expect(res.body.data).toBeDefined(); // Ensure the group object is returned

    group_id1 = (res.body.data)?._id;
  });
  it('should create a group when authenticated By Normal User (user1)', async () => {
    const res = await request(httpServer)
      .post('/create-group')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        groupName: "cricket 3"
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Group created successfully.');
    expect(res.body.data).toBeDefined(); // Ensure the group object is returned

    group_id1 = (res.body.data)?._id;
  });
  it('should create a group when authenticated By Normal User (user1)', async () => {
    const res = await request(httpServer)
      .post('/create-group')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        groupName: "cricket 2"
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Group created successfully.');
    expect(res.body.data).toBeDefined(); // Ensure the group object is returned

    group_id1 = (res.body.data)?._id;
  });
  it('should create a group when authenticated By Normal User (user1)', async () => {
    const res = await request(httpServer)
      .post('/create-group')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        groupName: "cricket boomers"
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Group created successfully.');
    expect(res.body.data).toBeDefined(); // Ensure the group object is returned

    group_id1 = (res.body.data)?._id;
  });

  // Step 4: Test group creation without token (should fail)
  it('should not create a group without token By Normal User(user1)', async () => {
    const res = await request(httpServer)
      .post('/create-group')
      .send({
        groupName: "cricket crackers"
      });

    expect(res.statusCode).toEqual(401); // Unauthorized
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('Authorization token is missing.');
  });

  
  it('should add Member (user 2) into group when authenticated By Normal User(user 1)', async () => {
    const res = await request(httpServer)
      .post('/add-member')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        groupId: group_id1,
        members : [user2]
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Succefully Added');
    expect(res.body.data).toBeDefined();

  });

  
  it(`should adding another(User 4) Member into group when authenticated By Normal  User(user 1) `, async () => {
    const res = await request(httpServer)
      .post('/add-member')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        groupId: group_id1,
        members : [user4]
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Succefully Added');
    expect(res.body.data).toBeDefined();

  });

  let user1msg1, user2msg1, user1msg2, user2msg2;
  it('should send Message 1 By Normal User(User 1)', async () => {
    const res = await request(httpServer)
      .post('/send-grpmessage')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        groupId: group_id1,
        message : "Hi Good Morning !"
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Message sent');
    expect(res.body.data).toBeDefined();
    user1msg1 = res.body.data._id;
  });

  
  it('should login as User and return JWT token (user 2)', async () => {
    const res = await request(httpServer)
      .post('/login')
      .send({
        mobile: 9963828075,
        password: "1234"
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Login successfully.');
    expect(res.body.token).toBeDefined(); // Ensure the token is returned

    // Store the token for further use in the next tests
    user2Token = res.body.token;
  });

  it('should User 1 Message Liked By Normal User2 (User 2)', async () => {
    const res = await request(httpServer)
      .post('/like-grpmessage')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        messageId: user1msg1
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Liked Successfully');
    expect(res.body.data).toBeDefined();

  });


  it('should send Message 1 By Normal User(User 2)', async () => {
    const res = await request(httpServer)
      .post('/send-grpmessage')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        groupId: group_id1,
        message : "Hi Good Morning User 1!"
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Message sent');
    expect(res.body.data).toBeDefined();
    user2msg1 = res.body.data._id;
  });


  it('should User2 Message Liked By Normal User1(User 1)', async () => {
    const res = await request(httpServer)
      .post('/like-grpmessage')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        messageId: user2msg1
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Liked Successfully');
    expect(res.body.data).toBeDefined();
    
   });

  it('should Access Group1 data to Group Members (User 1)', async () => {
    const res = await request(httpServer)
      .get('/get-group/'+group_id1)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('fetched');
    expect(res.body.data).toBeDefined();
    
   });

  it('should Access Group1 data to Group Members (User 2)', async () => {
    const res = await request(httpServer)
      .get('/get-group/'+group_id1)
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('fetched');
    expect(res.body.data).toBeDefined();
    
   });

   
  it('should Change the Group1 name by valid Group Members (User 2)', async () => {
    const res = await request(httpServer)
      .put('/change-group-name')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        groupId : group_id1,
        groupName : "Joys"
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Group Name has been changed');
    expect(res.body.data).toBeDefined();
    
   });

   it('should login as User and return JWT token (User3)', async () => {
    const res = await request(httpServer)
      .post('/login')
      .send({
        mobile: 9963828076,
        password: "1234"
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Login successfully.');
    expect(res.body.token).toBeDefined(); // Ensure the token is returned

    user3Token = res.body.token;
  });

  it('should NOT Access Group1 data to Non-Group Members (User 3)', async () => {
    const res = await request(httpServer)
      .get('/get-group/'+group_id1)
      .set('Authorization', `Bearer ${user3Token}`)
      .send({
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBeDefined();
    
   });
   
  it('should remove Member (user 2) into group when authenticated By Normal User(Group Admin)(user 1)', async () => {
    const res = await request(httpServer)
      .post('/remove-member')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        groupId: group_id1,
        members : [user2]
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Succefully removed');
    expect(res.body.data).toBeDefined();

  });

  it('should not remove non-existing Member (user 2) into group when authenticated By Normal User(Group Admin)(user 1)', async () => {
    const res = await request(httpServer)
      .post('/remove-member')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        groupId: group_id1,
        members : [user2]
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBeDefined();

  });

  it('should delete group when authenticated By Normal User(Group Admin)(user 1)', async () => {
    const res = await request(httpServer)
      .delete(`/delete-group/${group_id1}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({  });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Succefully deleted');
    expect(res.body.data).toBeDefined();

  });

  it('should not delete  non existing group when authenticated By Normal User(Group Admin)(user 1)', async () => {
    const res = await request(httpServer)
      .delete(`/delete-group/${group_id1}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({  });

    expect(res.statusCode).toEqual(404);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBeDefined();

  });

});



