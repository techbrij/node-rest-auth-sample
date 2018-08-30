/************************************
 * Author: Brij Mohan
 * https://techbrij.com
 * 
 ************************************/

import { request,chai } from "./common.test";
import sinon from "sinon";
import passport from 'passport';
import { cleanCollection } from "../models/project.model";

describe("# Project APIs Test with Sinon", () => {
    const apiBase = process.env.API_BASE || '/api';
    const newProject = { title: 'Project-1',
        summary: 'This is summary.',
        description: 'This is description',
        submitDate: new Date()}
    let should = chai.should(); 

    before(async ()=> {  
        let passportStub =  sinon.stub(passport,"authenticate").callsFake((strategy, options, callback) => {            
               callback(null, { "username": "test@techbrij.com"}, null);             
               return (req,res,next)=>{};
            });
    })
    after(() => {
        passport.authenticate.restore();
    });    
    it("should save the project", () => {       
            return request.post(apiBase + "/project")             
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
            .send(newProject)
            .expect(200)
            .then(()=>{
                return request.get(apiBase + "/project")                             
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



});