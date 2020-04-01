# B4 Performance Test Scripts

echo 'Running B4 tests...\n'

# FREQUENCY

# Frequency 1 Hz, Size 1 Kb
yarn start ../index.js --instance MEDIUM --server java --db sql --size 1 --freq 1 
yarn start ../index.js --instance MEDIUM --server node --db sql --size 1 --freq 1
yarn start ../index.js --instance MEDIUM --server java --db nosql --size 1 --freq 1
yarn start ../index.js --instance MEDIUM --server node --db nosql --size 1 --freq 1

sleep 5

# Frequency 2 Hz, Size 1 Kb
yarn start ../index.js --instance MEDIUM --server java --db sql --size 1 --freq 2 
yarn start ../index.js --instance MEDIUM --server node --db sql --size 1 --freq 2
yarn start ../index.js --instance MEDIUM --server java --db nosql --size 1 --freq 2
yarn start ../index.js --instance MEDIUM --server node --db nosql --size 1 --freq 2

sleep 5

# Frequency 3 Hz, Size 1 Kb
yarn start ../index.js --instance MEDIUM --server java --db sql --size 1 --freq 3 
yarn start ../index.js --instance MEDIUM --server node --db sql --size 1 --freq 3
yarn start ../index.js --instance MEDIUM --server java --db nosql --size 1 --freq 3
yarn start ../index.js --instance MEDIUM --server node --db nosql --size 1 --freq 3

sleep 5

# Frequency 4 Hz, Size 1 Kb
yarn start ../index.js --instance MEDIUM --server java --db sql --size 1 --freq 4 
yarn start ../index.js --instance MEDIUM --server node --db sql --size 1 --freq 4
yarn start ../index.js --instance MEDIUM --server java --db nosql --size 1 --freq 4
yarn start ../index.js --instance MEDIUM --server node --db nosql --size 1 --freq 4

sleep 5

# Frequency 5 Hz, Size 1 Kb
yarn start ../index.js --instance MEDIUM --server java --db sql --size 1 --freq 5 
yarn start ../index.js --instance MEDIUM --server node --db sql --size 1 --freq 5
yarn start ../index.js --instance MEDIUM --server java --db nosql --size 1 --freq 5
yarn start ../index.js --instance MEDIUM --server node --db nosql --size 1 --freq 5

sleep 5

# INCREASE REQUEST SIZE

# Frequency 1 Hz, Size 5 Kb
yarn start ../index.js --instance MEDIUM --server java --db sql --size 5 --freq 1 
yarn start ../index.js --instance MEDIUM --server node --db sql --size 5 --freq 1
yarn start ../index.js --instance MEDIUM --server java --db nosql --size 5 --freq 1
yarn start ../index.js --instance MEDIUM --server node --db nosql --size 5 --freq 1

sleep 5

# Frequency 2 Hz, Size 5 Kb
yarn start ../index.js --instance MEDIUM --server java --db sql --size 5 --freq 2 
yarn start ../index.js --instance MEDIUM --server node --db sql --size 5 --freq 2
yarn start ../index.js --instance MEDIUM --server java --db nosql --size 5 --freq 2
yarn start ../index.js --instance MEDIUM --server node --db nosql --size 5 --freq 2

sleep 5

# Frequency 3 Hz, Size 5 Kb
yarn start ../index.js --instance MEDIUM --server java --db sql --size 5 --freq 3 
yarn start ../index.js --instance MEDIUM --server node --db sql --size 5 --freq 3
yarn start ../index.js --instance MEDIUM --server java --db nosql --size 5 --freq 3
yarn start ../index.js --instance MEDIUM --server node --db nosql --size 5 --freq 3

sleep 5

# Frequency 4 Hz, Size 5 Kb
yarn start ../index.js --instance MEDIUM --server java --db sql --size 5 --freq 4 
yarn start ../index.js --instance MEDIUM --server node --db sql --size 5 --freq 4
yarn start ../index.js --instance MEDIUM --server java --db nosql --size 5 --freq 4
yarn start ../index.js --instance MEDIUM --server node --db nosql --size 5 --freq 4

sleep 5

# Frequency 5 Hz, Size 5 Kb
yarn start ../index.js --instance MEDIUM --server java --db sql --size 5 --freq 5 
yarn start ../index.js --instance MEDIUM --server node --db sql --size 5 --freq 5
yarn start ../index.js --instance MEDIUM --server java --db nosql --size 5 --freq 5
yarn start ../index.js --instance MEDIUM --server node --db nosql --size 5 --freq 5

sleep 5

echo '\nB4 tests complete'