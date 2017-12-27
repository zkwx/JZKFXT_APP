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
    async GetDisableds(param) {
        return await http.get('Disableds', param)
    },
    async GetDisabled(ID) {
        return await http.get('Disableds/' + ID)
    },
    async GetDisabilityReasons(categoryID) {
        return await http.get('DisabilityReasons?categoryID=' + categoryID)
    },
    async GetQuestions() {
        return await http.get('Questions?loadQuestions=true')
    },
    async GetExam(examID) {
        return await http.get('Exams/' + examID)
    },
    async GetAnswers(param) {
        return await http.get('Answers' + param)
    },
    async GetRoles() {
        return await http.get('Roles')
    },

}