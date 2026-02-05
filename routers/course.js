const express = require(`express`)
const Note = require(`../models/note`)
const Course = require(`../models/course`)
const auth = require(`../middleware/auth`)
const router = new express.Router()

//get all courses
router.get(`/courses`, auth, async (req, res) => {
    try {
        /*what this is saying is  go look up all Course documents where
        course.owner === req.user._id and temporarily attach them to 
        req.user.courses.*/
        await req.user.populate('courses')
        res.status(200).send(req.user.courses)
    }catch(err) {
        res.status(500).send()
        console.log(`Error: ${err}`)
    }
})

//create course
router.post(`/courses`, auth, async (req, res) => {
    try {
        const course = new Course({
            ...req.body,
            owner: req.user._id
        })

        await course.save()
        res.status(201).send(course)

    }catch(err) {
        res.status(400).send()
        console.log(`Error: ${err}`)
    }
})

//delete course
router.delete(`/courses/:courseId`, auth, async(req, res) => {
    try {
        const course = await Course.findOneAndDelete({_id: req.params.courseId, owner: req.user._id})
        
        if(!course) {
            throw new Error("Course doesn't exist")
        }
        
        await Note.deleteMany({course: req.params.courseId})
        res.status(200).send({course})
    }catch(err) {
        res.status(400).send()
        console.log(`${err}`)
    }
})

//delete all courses
router.delete('/courses', auth, async (req, res) => {
  try {
    // 1️⃣ get all course IDs for this user
    const courses = await Course.find({ owner: req.user._id }).select('_id')

    if (courses.length === 0) {
      return res.status(404).send({ error: "User hasn't added any courses yet" })
    }

    const courseIds = courses.map(c => c._id)

    // 2️⃣ delete all notes for those courses
    await Note.deleteMany({ course: { $in: courseIds } })

    // 3️⃣ delete the courses
    const result = await Course.deleteMany({ _id: { $in: courseIds } })

    res.status(200).send({ deletedCourses: result.deletedCount })
  } catch (err) {
    res.status(500).send()
    console.log(err)
  }
})


module.exports = router