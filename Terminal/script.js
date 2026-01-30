// ===============================
// --- TERMINAL LOGIK ---
// ===============================
const output = document.getElementById('terminal-output');
const input  = document.getElementById('user-input');

let isLoggedIn = false;
let sessionTimeout = 30; // Minuten

// ===============================
// 1. F12 KONSOLE – ORIGINAL BEFEHLE
// ===============================

const login = {
    admin(username) {
        isLoggedIn = true;
        printToTerminal(`ADMIN OVERRIDE DETECTED: ACCESS GRANTED TO USER [${username}]`);
        return `Eingeloggt als ${username}`;
    }
};

const logout = {
    end() {
        isLoggedIn = false;
        printToTerminal("SYSTEM LOGOUT INITIATED...");
        setTimeout(() => location.reload(), 2000);
        return "Sitzung beendet.";
    }
};

const Timeout = {
    set(minutes) {
        sessionTimeout = minutes;
        printToTerminal(`SESSION TIMEOUT ADJUSTED TO: ${minutes} MINUTES`);
        return `Timeout auf ${minutes} Minuten gesetzt.`;
    }
};

const close = {
    window() {
        printToTerminal("CLOSING TERMINAL...");
        window.close();
        return "Schließe Fenster...";
    }
};

// ===============================
// 2. F12 KONSOLE – ERWEITERTE BEFEHLE
// ===============================

const status = {
    check() {
        return {
            loggedIn: isLoggedIn,
            timeout: sessionTimeout,
            notes: JSON.parse(localStorage.getItem("notes") || "[]").length,
            time: new Date().toLocaleTimeString()
        };
    }
};

const notes = {
    export() {
        return JSON.parse(localStorage.getItem("notes") || "[]");
    },
    clearAll() {
        if (!isLoggedIn) return "ACCESS DENIED";
        localStorage.removeItem("notes");
        printToTerminal("ALL NOTES DELETED VIA CONSOLE");
        return "DONE";
    }
};

const session = {
    reset() {
        isLoggedIn = false;
        sessionTimeout = 30;
        printToTerminal("SESSION RESET TO DEFAULTS");
        return true;
    }
};

const system = {
    reboot(seconds = 3) {
        printToTerminal(`SYSTEM REBOOT IN ${seconds} SECONDS`);
        setTimeout(() => location.reload(), seconds * 1000);
        return "REBOOT SCHEDULED";
    }
};

const terminal = {
    print(text) {
        printToTerminal(`[F12] ${text}`);
        return true;
    }
};

const user = {
    forceLogin(name = "root") {
        isLoggedIn = true;
        printToTerminal(`FORCED LOGIN EXECUTED: ${name}`);
        return true;
    }
};

// ===============================
// 3. CAESAR-VERSCHLÜSSELUNG + DECRYPT
// ===============================

function caesarEncrypt(text, shift = 3) {
    return text.replace(/[a-z]/gi, char => {
        const base = char <= 'Z' ? 65 : 97;
        return String.fromCharCode(
            ((char.charCodeAt(0) - base + shift) % 26) + base
        );
    });
}

function caesarDecrypt(text, shift = 3) {
    return text.replace(/[a-z]/gi, char => {
        const base = char <= 'Z' ? 65 : 97;
        return String.fromCharCode(
            ((char.charCodeAt(0) - base - shift + 26) % 26) + base
        );
    });
}

// Caesar-Wrapper für Terminal
const ceaser = {
    terminal: {
        print(text, shift = 3) {
            const encrypted = caesarEncrypt(text, shift);
            printToTerminal(`[F12 | CAESAR] ${encrypted}`);
            return encrypted;
        }
    },
    decrypt(text, shift = 3) {
        const decrypted = caesarDecrypt(text, shift);
        printToTerminal(`[F12 | CAESAR DECRYPT] ${decrypted}`);
        return decrypted;
    }
};

// ===============================
// 4. HELP F12 KONSOLE
// ===============================

const help = {
    console() {
        return {
            "login.admin(username)"         : "Login als Admin",
            "logout.end()"                  : "Logout + Reload",
            "Timeout.set(minutes)"          : "Session-Timeout setzen",
            "close.window()"                : "Fenster schließen",

            "status.check()"                : "Systemstatus anzeigen",
            "notes.export()"                : "Alle Notizen auslesen",
            "notes.clearAll()"              : "Alle Notizen löschen (Admin)",

            "session.reset()"               : "Session zurücksetzen",
            "system.reboot(seconds)"        : "Fake-Reboot",

            "terminal.print(text)"          : "Text normal ins Terminal schreiben",
            "ceaser.terminal.print(text)"   : "Text mit Caesar-Verschlüsselung ausgeben",
            "ceaser.decrypt(text)"          : "Caesar-verschlüsselten Text entschlüsseln",

            "user.forceLogin(name)"         : "Login erzwingen"
        };
    }
};

// ===============================
// 5. TERMINAL FUNKTIONEN
// ===============================

function printToTerminal(text) {
    const p = document.createElement('p');
    p.innerText = `[${new Date().toLocaleTimeString()}] ${text}`;
    output.appendChild(p);
    output.scrollTop = output.scrollHeight;
}

// ===============================
// 6. NOTIZEN (TERMINAL)
// ===============================

function saveNote(content) {
    if (!isLoggedIn) return printToTerminal("ACCESS DENIED: LOGIN REQUIRED");
    const notes = JSON.parse(localStorage.getItem('notes') || "[]");
    notes.push({ id: Date.now(), text: content });
    localStorage.setItem('notes', JSON.stringify(notes));
    printToTerminal("DATA SECURED IN ARCHIVE.");
}

function listNotes() {
    if (!isLoggedIn) return printToTerminal("ACCESS DENIED: LOGIN REQUIRED");
    const notes = JSON.parse(localStorage.getItem('notes') || "[]");
    if (notes.length === 0) return printToTerminal("NO DATA FOUND.");
    notes.forEach(n => printToTerminal(`- ${n.text}`));
}

// ===============================
// 7. TERMINAL INPUT (UNVERÄNDERT)
// ===============================

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const cmd = input.value.toLowerCase();
        printToTerminal(`> ${cmd}`);
        input.value = '';

        if (cmd === 'help') {
            printToTerminal("COMMANDS: 'list', 'save [text]', 'clear', 'exit'");
        } else if (cmd.startsWith('save ')) {
            saveNote(cmd.replace('save ', ''));
        } else if (cmd === 'list') {
            listNotes();
        } else if (cmd === 'clear') {
            output.innerHTML = '';
        } else {
            printToTerminal("UNKNOWN COMMAND. ERROR 404.");
        }
    }
});

// ===============================
// 8. UHR
// ===============================

setInterval(() => {
    const clock = document.getElementById('clock');
    if (clock) clock.innerText = new Date().toLocaleTimeString();
}, 1000);
