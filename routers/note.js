const express = require(`express`)
const Note = require(`../models/note`)
const auth = require(`../middleware/auth`)
const router = new express.Router()

//create note
router.post(`/courses/:courseId/notes`, auth, async (req, res) => {
    try {
        const note = await Note.create({
            ...req.body,
            course: req.params.courseId,
            owner: req.user._id
        })
        await note.save()
        res.status(201).send({note})
    } catch(err) {
        res.status(400).send({err})
        console.log(err)
    }
})

//get notes with filtering options
router.get(`/notes`, auth, async (req, res) => {
    //notes/?sortBy=createdAt_asc
    try {
        const filter = {owner: req.user._id}
        const sort = {}

        //filter
        if(req.query.course) {
            filter.course = req.query.course
        }

        if(req.query.type) {
            filter.noteType = req.query.type
        }

        //sort
        if(req.query.sortBy) {
            const parts = req.query.sortBy.split('_')
            const field = parts[0]
            const order = parts[1] === 'asc' ? 1 : -1

            sort[field] = order
        } 
        else {
            sort.createdAt = -1
        }

        const notes = await Note.find(filter).sort(sort).populate('course')
        res.status(200).send({notes})
    }catch(err) {
        console.log(err)
        res.status(400).send()
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