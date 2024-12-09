const express = require("express");
const router = express.Router();
const { logMessage } = require("../utils/system.utils");
const { updateStudent, getDeal, fetchDealContacts, fetchCustomEntityForDeal, updateContact, getStudent } = require("../utils/bitrix.utils");


router.post('/syncdealwithall', async (req, res) => {
    logMessage('hit syncdealwithall endpoint', 'Success', 'Info')
    const { dealId } = req.query
    if(!dealId){
        logMessage('Bad request', 'Error: no dealid was sent', 'Error')
        return res.status(400).json({status: 'faild'})
    }

    try {
        const { ASSIGNED_BY_ID } = await getDeal(dealId);
        const contacts = await fetchDealContacts(dealId);
        const dealStudents = await fetchCustomEntityForDeal(dealId, 1068)
        for(const contact of contacts){
            if(contact["CONTACT_ID"]){
                await updateContact(contact["CONTACT_ID"], {"ASSIGNED_BY_ID": ASSIGNED_BY_ID})
            }
        }
        for(const student of dealStudents){
            if(student["id"]){
            await updateStudent(student["id"], { assignedById: ASSIGNED_BY_ID });
            const { contactIds: contacts } = await getStudent(1068, student["id"]);
            if(contacts && contacts.length > 0){
                for(const contact of contacts){
                    await updateContact(contact, {"ASSIGNED_BY_ID": ASSIGNED_BY_ID})
                }
            }
            }
        }
        return res.json({status: "success"})
    } catch (error){
        logMessage('Internal error', `Error: ${JSON.stringify(error)}`, 'Error')
        return res.status(500).json({status: 'faild'})
    }
})


module.exports = router