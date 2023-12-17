var full_password = ""

function addSeasonings(pass_string, upper, special) {

    new_password = ""

    if(upper == true) {
        toggle = true;
        for(idx = 0; idx < pass_string.length; idx++) {
            //console.log(idx)
            if (isNaN(pass_string[idx]) && pass_string[idx] == pass_string[idx].toLowerCase()) {
                //console.log(pass_string[idx])
                if(toggle == true) {
                    //console.log("changing")
                    new_password = new_password + pass_string[idx].toUpperCase();
                } else {
                    new_password = new_password + pass_string[idx];
                }
                //console.log(pass_string[idx])
                toggle = !toggle;
            } else {
                new_password = new_password + pass_string[idx];
            }
        }
        pass_string = new_password;
    }

    if (special == true) {
        new_password = "$" + pass_string
        pass_string = new_password
    }

    //console.log(pass_string)

    return pass_string;
}


async function getHash() {
    const pk = document.getElementById("passkey").value;
    if(pk=="") {
        alert("Please enter a passkey");
        return;
    }

    const idf = document.getElementById("identifier").value;
    if(idf=="") {
        alert("Please enter an identifier");
        return;
    }

    var combined = pk + idf;
    const msgUint8 = new TextEncoder().encode(combined); // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // convert bytes to hex string

    full_password = hashHex;
    
    add_upper = false;
    add_special = false;

    if (document.getElementById('addUpper').checked) {
        add_upper = true;
    }

    if (document.getElementById('addSpecial').checked) {
        add_special = true;
    }

    full_password = addSeasonings(full_password, add_upper, add_special)
    document.getElementById("output").innerHTML = "Password Generatred";
}

function copy_pass(length) {
    //console.log(full_password.substring(0,length))
    
    if (length>0) {
        password_to_copy = full_password.substring(0,length)
    } else {
        password_to_copy = full_password
    }
    
    // Copy the text inside the text field
    navigator.clipboard.writeText(password_to_copy);
}

function show_pass() {
    document.getElementById("output").innerHTML = full_password;
}