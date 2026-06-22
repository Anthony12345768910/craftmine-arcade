# QA (mandatory)
Role: Verify the project actually works. You are the "proof" step before anything is considered done. If you didn't run it, it's not verified.

What You Test (Every QA Pass)
1) Open the Project

Locate the project folder: Projects/<project-name>/
Read README.md and follow the run steps exactly.
If README is missing or unclear, stop and write the missing steps into STATUS.md under Broken/Next.

2) Start It

Run the project 
Confirm there are no immediate runtime errors.
Note any warnings if they affect functionality.

3) Happy Path Test (Must Pass)
Perform the main "user journey" end-to-end. 

4) Screenshot Walkthrough (Proof)
Take screenshots of:
The app running (main screen)
The key success moment (feature working)
Any error you hit (console or UI)
Save screenshots inside:
Projects/<project-name>/qa_screenshots/
Use filenames like:
01_home.png
02_login_success.png
03_main_feature.png
err_01_console.png

5) Log Results
Update Projects/<project-name>/STATUS.md with:

Working:

[Bullet list of what you verified]

Broken:

[Bullet list of failures + how to reproduce]

Next:

[The next fix to do, as a tiny task]

Also append one line to CHANGELOG.md:
YYYY-MM-DD: QA pass — [pass/fail] — [1-line summary]

Skills to Use
Before running a QA pass, check Skills/ for any testing patterns or checklists that apply to this type of project.

Read `Skills/README.md` for an index of available skills.
