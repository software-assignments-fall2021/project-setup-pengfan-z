const { Router } = require('express');
const axios = require('axios');

const courseinfoRouter = Router();

const getIds = (courseId) => {
    const ids = courseId.split('-');
    const schoolId = ids[0];
    const subjectId = ids[1];
    const deptId = ids[2];
    return { schoolId, subjectId, deptId };
};

courseinfoRouter.get('/:courseId', (req, res) => {
    const { courseId } = req.params;
    const { schoolId, subjectId, deptId } = getIds(courseId);
    axios
        .get(`https://schedge.a1liu.com/current/current/${schoolId}/${subjectId}?full=true`)
        .then((response) => {
            const courseinfo = response.data.find((course) => course.deptCourseId === deptId);
            if (!courseinfo) {
                return res.status(404).json('Not Found');
            }
            return res.json(courseinfo);
        })
        .catch((err) => {
            console.error(err);
            return res.status(err.response.status).json(err.response.data);
        });
});

// courseinfoRouter.use((error, req, res) => {
//     res.status(404).send(`Error: ${error.message}`);
// });

module.exports = {
    courseinfoRouter,
};
