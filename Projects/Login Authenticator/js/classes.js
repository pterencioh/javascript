class LoginDate extends Date{
    fullDate() {
        const year = this.getFullYear();
        const month = (this.getMonth() + 1).toString().padStart(2, '0');
        const day = this.getDate().toString().padStart(2, '0');
        const hours = this.getHours().toString().padStart(2, '0');
        const minutes = this.getMinutes().toString().padStart(2, '0');
        const seconds = this.getSeconds().toString().padStart(2, '0');
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}

module.exports = { LoginDate }

