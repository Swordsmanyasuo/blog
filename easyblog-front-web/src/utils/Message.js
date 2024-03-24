import { ElMessage } from 'element-plus'


const message = {
    error: (msg) => {
        ElMessage({
            type: "error",
            message: msg,
            duration: 2000,
        });
    },
    success: (msg) => {
        ElMessage({
            type: "success",
            message: msg,
            duration: 2000,
        });
    },
    warnning: (msg) => {
        ElMessage({
            type: "error",
            message: msg,
            duration: 2000,
        });
    }
}
export default message;