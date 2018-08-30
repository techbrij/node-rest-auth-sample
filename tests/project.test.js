import { request, loginWithDefaultUser,chai } from "./common.test";
import { cleanCollection } from "../models/project.model";
describe("# Project APIs", () => {
    const apiBase = process.env.API_BASE || '/api';
    const newProject = { title: 'Project-1',
        summary: 'This is summary.',
        description: 'This is description',
        submitDate: new Date()}
    let should = chai.should(); 
    let token;

    before(async ()=> {        
        //get token
        let resToken =  await loginWithDefaultUser();
        token = resToken.body.token;       

    })    
    it("should save the project", () => {       
            return request.post(apiBase + "/project")
                .set("Authorization", token)
                .send(newProject)
                .expect(200)
                .expect(res => {
                    res.body.success.should.be.true;
                    res.body.msg.should.equal("New project is created successfully.");
                })
    });

    it("should get list of projects", () => {
        return cleanCollection().then(()=>{
            return request.post(apiBase + "/project")
            .set("Authorization", token)
            .send(newProject)
            .expect(200)
            .then(()=>{
                return request.get(apiBase + "/project")
                            .set("Authorization", token)    
                            .send()       
                            .expect(200)
                            .expect(res =>{                
                                res.body.should.be.an('array').to.have.lengthOf(1);    
                                let item = res.body[0];                            
                                item.should.have.property('title').to.equal(newProject.title);
                                item.should.have.property('summary').to.equal(newProject.summary);
                                item.should.have.property('description').to.equal(newProject.description);
                            }); 
                        })
        })         

    });


      it("should return 401 with expired token", () => {
        return request.post(apiBase + "/project")
            .set("Authorization", "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YjcwMWQyNGQ2ZjIyYTJiZThiYjg1MzYiLCJ1c2VybmFtZSI6InRlc3RAdGVjaGJyaWouY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkTEJNQy5tQVFxWWNmLjVZSlRlSVNlT1cvUVp1NWJ5WVN4anJmSGFQUTJZZVlkWXR6Y25lbFMiLCJfX3YiOjAsImlhdCI6MTUzNDQzODk0MywiZXhwIjoxNTM0NDM5MDYzfQ.zFMsJiny3At6vJRsjl8AzKnjlTMGVc1fdZnH2kwu6dQ")
            .send(newProject)
            .expect(res => {               
                res.body.message.should.equal("Your token has expired.")
            })
            .expect(401);
    });



});