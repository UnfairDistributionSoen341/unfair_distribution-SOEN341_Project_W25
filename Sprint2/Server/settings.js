document.addEventListener("DOMContentLoaded", function () {
    const settingsButton = document.getElementById("settingsButton");
    const settingsDropdown = document.getElementById("settingsDropdown");

    // Toggle the dropdown when clicking the settings button
    settingsButton.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevent click from propagating
        settingsDropdown.style.display = settingsDropdown.style.display === "block" ? "none" : "block";
    });

    // Prevent clicks inside the dropdown from closing it
    settingsDropdown.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    // Close dropdown if clicking outside
    document.addEventListener("click", function () {
        settingsDropdown.style.display = "none";
    });

    // Promote to Admin functionality
    const promoteToAdminBtn = document.getElementById("promoteToAdmin");
    promoteToAdminBtn.addEventListener("click", async () => {
        if (!selectedServer) {
            alert("❌ Please select a server first.");
            return;
        }

        // Check if the current user is the owner
        const userRole = await getCurrentUserRole(selectedServer.id, currentUser.uid);
        if (userRole !== "owner") {
            alert("❌ Only the owner can promote members to admin.");
            return;
        }

        // Fetch members and display a list for promotion
        try {
            const membersRef = ref(db, `servers/${selectedServer.id}/members`);
            const snapshot = await get(membersRef);

            if (snapshot.exists()) {
                let membersList = `👥 Members of "${selectedServer.name}":\n`;
                const membersArray = [];
                snapshot.forEach((memberSnap) => {
                    const memberData = memberSnap.val();
                    if (memberData.role === "member") { // Only show members (not admins)
                        membersList += `- ${memberData.username}\n`;
                        membersArray.push({ uid: memberSnap.key, username: memberData.username });
                    }
                });

                if (membersArray.length === 0) {
                    alert("❌ No members available to promote.");
                    return;
                }

                const usernameToPromote = prompt(`${membersList}\nEnter the username you want to promote to admin:`);

                if (!usernameToPromote) {
                    return; // User canceled
                }

                const memberToPromote = membersArray.find(member =>
                    member.username.toLowerCase() === usernameToPromote.trim().toLowerCase()
                );

                if (memberToPromote) {
                    // Update the member's role to admin in Firebase
                    await set(ref(db, `servers/${selectedServer.id}/members/${memberToPromote.uid}/role`), "admin");
                    alert(`✅ ${memberToPromote.username} has been promoted to admin!`);
                } else {
                    alert(`❌ User "${usernameToPromote}" not found.`);
                }
            } else {
                alert("❌ No members found in this server.");
            }
        } catch (error) {
            console.error("❌ Error promoting member:", error);
            alert("Failed to promote member.");
        }
    });

    // Demote to Member functionality
    const demoteToMemberBtn = document.getElementById("demoteToMember");
    demoteToMemberBtn.addEventListener("click", async () => {
        if (!selectedServer) {
            alert("❌ Please select a server first.");
            return;
        }

        // Check if the current user is the owner
        const userRole = await getCurrentUserRole(selectedServer.id, currentUser.uid);
        if (userRole !== "owner") {
            alert("❌ Only the owner can demote admins to member.");
            return;
        }

        // Fetch admins and display a list for demotion
        try {
            const membersRef = ref(db, `servers/${selectedServer.id}/members`);
            const snapshot = await get(membersRef);

            if (snapshot.exists()) {
                let adminsList = `👥 Admins of "${selectedServer.name}":\n`;
                const adminsArray = [];
                snapshot.forEach((memberSnap) => {
                    const memberData = memberSnap.val();
                    if (memberData.role === "admin") { // Only show admins
                        adminsList += `- ${memberData.username}\n`;
                        adminsArray.push({ uid: memberSnap.key, username: memberData.username });
                    }
                });

                if (adminsArray.length === 0) {
                    alert("❌ No admins available to demote.");
                    return;
                }

                const usernameToDemote = prompt(`${adminsList}\nEnter the username you want to demote to member:`);

                if (!usernameToDemote) {
                    return; // User canceled
                }

                const adminToDemote = adminsArray.find(admin =>
                    admin.username.toLowerCase() === usernameToDemote.trim().toLowerCase()
                );

                if (adminToDemote) {
                    // Update the admin's role to member in Firebase
                    await set(ref(db, `servers/${selectedServer.id}/members/${adminToDemote.uid}/role`), "member");
                    alert(`✅ ${adminToDemote.username} has been demoted to member!`);
                } else {
                    alert(`❌ User "${usernameToDemote}" not found.`);
                }
            } else {
                alert("❌ No members found in this server.");
            }
        } catch (error) {
            console.error("❌
