const express = require(`express`)
const Note = require(`../models/note`)
const auth = require(`../middleware/auth`)
const router = new express.Router()

//create note
router.post(`/courses/:courseId/notes`, auth, async (req, res) => {
    try {
        //THIS NEEDS TO EDITIED TO BE MORE SPECIFIC LATER
        const note = await Note.create({
            ...req.body
        })
        await note.save()
        res.status(200).send({note})
    } catch(err) {
        res.status(400).send({err})
        console.log(err)
    }
})

//get all notes for course
router.get(`/courses/:courseId/notes`, auth, async (req, res) => {
    try {
        const notes = await Note.find({course: req.params.courseId})
        
        if(!notes) {
            throw new Error("No notes found for course")
        }
        res.status(200).send({notes})
    }catch(err) {
        res.status(404).send({err})
        console.log(err)
    }
})

//get notes of specific type for course
router.get(`/courses/:courseId/:type/notes`, auth, async (req, res) => {
    try {
        const notestoFind = await Note.find({course: req.params.courseId, noteType: req.params.type})

        if(!notestoFind) {
            throw new Error(`No ${req.params.type} notes found for the course`)
        }
        res.status(200).send({notestoFind})
    } catch(err) {
        res.status(404).send()
        console.log(err)
    }
})

//delete all notes for a course
router.delete(`/courses/:courseId/notes`, auth, async (req, res) => {
    try {
        const notes = await Note.deleteMany({course: req.params.courseId})

        if(notes.deletedCount === 0) {
            throw new Error("No notes created for the course")
        }
        res.status(200).send({notes})

    } catch(err) {
        res.status(404).send()
        console.log(err)
    }
})

//delete note
router.delete(`/notes/:noteId`, auth, async(req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.noteId)
        
        if(!note) {
            throw new Error("No note found")
        }
    
        res.status(200).send({note})
    }catch(err) {
        res.status(404).send()
        console.log(err)
    }
})

//delete all notes
router.delete(`/notes`, auth, async (req, res) => {
    try {
        const notes = await Note.deleteMany({})

        if(!notes) {
            throw new Error("No notes created")
        }
        res.status(200).send({notes})
    }catch(err) {
        res.status(400).send()
        console.log(err)
    }
})

module.exports = router