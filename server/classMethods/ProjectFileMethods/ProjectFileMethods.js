import {check} from "meteor/check";
import Project from "../../../imports/classes/Project";
import Invitation from "../../../imports/classes/Invitation";
import cryptoServer from "../../../imports/cryptoServer";
import User from "../../../imports/classes/User";
import ProjectNotification from "../../../imports/classes/ProjectNotification";
import ProjectFile from "../../../imports/classes/ProjectFile";
import minioTools from "../../../imports/minioTools";


ProjectFile.extend({
    meteorMethods: {
        async newProjectFile(authInfo, projectFileParams) {
            check(authInfo, {memberId: String, userSignature: String})
            check(projectFileParams, {
                symEnc_fileName: String,
                size: Number,
                symEnc_mimeType: String,
                projectId: String
            })
            let currentProject = Project.findOne(projectFileParams.projectId)
            check(currentProject.isMember(authInfo), true)

            let newProjectFile = new ProjectFile(projectFileParams)
            newProjectFile.createdBy = authInfo.memberId
            let id = newProjectFile.save()
            const result = await minioTools.client.presignedPutObject('project-files', id)
            return {url: result, id: id}
        },
        async deleteProjectFile(authInfo, fileId) {
            check(authInfo, {memberId: String, userSignature: String})
            let file = ProjectFile.findOne(fileId)
            let currentProject = Project.findOne(file.projectId)
            check(currentProject.isMember(authInfo), true)

            const resultDelete = await minioTools.client.removeObject('project-files', file._id)
            return {servRes: file.remove(), minioRes: resultDelete}
        },
        async getFileUrl(authInfo, fileId) {
            check(authInfo, {memberId: String, userSignature: String})
            check(fileId, String)
            let file = ProjectFile.findOne(fileId)
            let currentProject = Project.findOne(file.projectId)
            check(currentProject.isMember(authInfo), true)


            return await minioTools.client.presignedGetObject('project-files', fileId)


        },
    }
})