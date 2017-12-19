import http from '@/http/http.js'
export default {
    async GetCategories() {
        return await http.get('Categories')
    },
    async GetDegrees() {
        return await http.get('Degrees')
    },
    async GetNexts() {
        return await http.get('Nexts')
    },
    async GetRehabilitationData() {
        return await http.get('Rehabilitations?group=true')
    },
    async GetDisabledInfoes(param) {
        return await http.get('DisabledInfoes', param)
    },
    async GetDisabledInfo(ID) {
        return await http.get('DisabledInfoes/' + ID)
    },
    async GetDisabilityReasons(categoryID) {
        return await http.get('DisabilityReasons?categoryID=' + categoryID)
    },
    async GetQuestions() {
        return await http.get('Questions?loadQuestions=true')
    },
    async GetExam(targetExamName) {
        return await http.get('Exams?targetExamName=' + targetExamName)
    },
    async GetAnswers(param) {
        return await http.get('Answers' + param)
    },
    async GetRoles() {
        return await http.get('Roles')
    },

}