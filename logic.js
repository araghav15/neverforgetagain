var full_password = ""

function addSeasonings(pass_string, upper, special) {

    new_password = ""

    if(upper == true) {
        toggle = true;
        for(idx = 0; idx < pass_string.length; idx++) {
            if (isNaN(pass_string[idx]) && pass_string[idx] == pass_string[idx].toLowerCase()) {
                if(toggle == true) {
                    new_password = new_password + pass_string[idx].toUpperCase();
                } else {
                    new_password = new_password + pass_string[idx];
                }
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

    return pass_string;
}

async function getPassword() {

    // Get the passkey from the textbox
    const passkey = document.getElementById("passkey").value;
    if(passkey=="") {
        alert("Please enter a passkey");
        return;
    }

    // Get the identifier from the textbox
    const identifier = document.getElementById("identifier").value;
    if(identifier=="") {
        alert("Please enter an identifier");
        return;
    }

    const enc = new TextEncoder();

    // Create the basekey (this will be used in HMAC with HASH(identifier) as salt)
    var baseKey = await crypto.subtle.importKey(
        "raw",
        enc.encode(passkey),
        "PBKDF2",
        false,
        ["deriveBits", "deriveKey"],
      );

    // Salt = Hash(identifier) to increase the length
    const salt = enc.encode(identifier);
    const salt_buffer = await crypto.subtle.digest("SHA-512", salt);

    const key = await crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: salt_buffer,
          iterations: 1000000,
          hash: "SHA-512",
        },
        baseKey,
        { name: "HMAC", hash: "SHA-512"},
        true,
        ["sign"],
      );

    const keyBuffer = await crypto.subtle.exportKey("raw", key)
    const keyBufferArray = Array.from(new Uint8Array(keyBuffer)); // convert buffer to byte array
    const keyHex = keyBufferArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // convert bytes to hex string

    // keyHex is 512 characters. Extract 32 characters from that.
    // Rest 480 would be entropy if someone wants to break the key!
    full_password = keyHex.substring(128, 160);
    
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