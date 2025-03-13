// Initialize Supabase
const supabaseUrl = 'https://fnsupvjcaidujzjxuszc.supabase.co';  // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuc3VwdmpjYWlkdWp6anh1c3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4ODgxNzIsImV4cCI6MjA1NzQ2NDE3Mn0.1XSmRO2oLDXncidXSveS3R00l_kNTpTQy9GHZjHwpBA';  // Replace with your Supabase anon key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const saveButton = document.getElementById('saveButton');
const loadButton = document.getElementById('loadButton');
const noteText = document.getElementById('noteText');
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');

// Authenticate the user (login)
const loginUser = async () => {
  const { user, error } = await supabase.auth.signIn({
    email: '1019628@rochesterschools.org',  // Replace with a dynamic input field if needed
    password: 'TENNISISMYSECONDHOME'  // Replace with a dynamic input field if needed
  });

  if (error) {
    alert('Error logging in: ' + error.message);
  } else {
    alert('User signed in!');
    loginButton.style.display = 'none';
    logoutButton.style.display = 'inline';
  }
};

// Logout the user
const logoutUser = async () => {
  await supabase.auth.signOut();
  loginButton.style.display = 'inline';
  logoutButton.style.display = 'none';
  alert('Logged out successfully!');
};

// Function to save note to Supabase
const saveNote = async () => {
  const note = noteText.value;
  const user = supabase.auth.user();

  if (!user) {
    alert('Please log in first!');
    return;
  }

  const { data, error } = await supabase
    .from('notes')
    .upsert({ note, user_id: user.id, created_at: new Date() });

  if (error) {
    console.error('Error saving note:', error);
    alert('Error saving note!');
  } else {
    alert('Note saved to Supabase!');
  }
};

// Function to load note from Supabase
const loadNote = async () => {
  const user = supabase.auth.user();

  if (!user) {
    alert('Please log in first!');
    return;
  }

  const { data, error } = await supabase
    .from('notes')
    .select('note')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error loading note:', error);
    alert('No saved notes found.');
  } else {
    noteText.value = data ? data.note : '';
  }
};

// Event listeners
saveButton.addEventListener('click', saveNote);
loadButton.addEventListener('click', loadNote);
loginButton.addEventListener('click', loginUser);
logoutButton.addEventListener('click', logoutUser);

// Handle session state
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    loginButton.style.display = 'none';
    logoutButton.style.display = 'inline';
  } else {
    loginButton.style.display = 'inline';
    logoutButton.style.display = 'none';
  }
});
