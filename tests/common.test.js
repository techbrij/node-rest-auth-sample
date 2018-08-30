/************************************
 * Author: Brij Mohan
 * https://techbrij.com
 * 
 ************************************/

process.env.NODE_ENV = "test";
process.env.API_BASE = "/api";

import User from  "../models/user.model";
import express from "../app";

export const request = require("supertest")(express);
export const chai = require("chai");
export const should = chai.should();

const defaultUser = { "username": "test@techbrij.com", "password": "test" };

const createUser = async () => {
    const UserModel = new User(defaultUser);
    await UserModel.save();
};

const getDefaultUser = async () => {
    let users = await User.find({ "username" : defaultUser.username });
    if (users.length === 0) {
        await createUser();
        return getDefaultUser();
    } else {
        return users[0];
    }
};

export const loginWithDefaultUser = async () => {
    let user = await getDefaultUser();
    return request.post(process.env.API_BASE + "/auth/signin")
        .send({ "username": defaultUser.username, "password": defaultUser.password })
        .expect(200);
};

export const cleanExceptDefaultUser = async () => {
    let user = await getDefaultUser();
    await User.deleteMany({ "username": {$ne: user.username}});    
};