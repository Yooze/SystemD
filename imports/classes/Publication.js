import {Class} from 'meteor/jagi:astronomy';
import Publications from "../../lib/collections/Publications";

const TextualContent = Class.create({
    name: "TextualContent",
    fields:{
        symEnc_text:String
    }
})
const PollOption = Class.create({
    name: "PollContent",
    fields:{
        symEnc_label:String,
        checkedBy: {
            type : [String],
            default: function () {
                return [];
            }

        }
    }
})
const PollContent = Class.create({
    name: "PollContent",
    fields:{
        symEnc_text:String,
        type:String,
        usersAllowedToAddOptions:Boolean,
        options: {
            type: [PollOption],
            default: function () {
                return [];
            }
        }
    }
})

const Publication = Class.create({
    name: 'Publication',
    collection: Publications,
    fields: {
        projectId: {
            type: String,
            index: 1
        },
        type: {
            type: String
        },
        createdBy: {
            type:String
        },
        topicId: {
            type:String,

            index:1
        },
        membersToNotify: {
            type: [String],
            default: function () {
                return [];
            }
        },
        createdAt:{
            type: Date,
            default: function () {
                return new Date()
            },
            index:-1
        },
        content:{
            type:[TextualContent, PollContent]
        }

    },
    helpers: {
    }

});

export default Publication