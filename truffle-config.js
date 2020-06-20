module.exports = {
    networks: {
        development: {
            host: 'localhost',
            port: 7545,
            gas: 9700000,
            network_id: '*' // Match any network id
            
        }
    },
    compilers: {
        solc: { 
          settings: {0.4.18:
            optimizer: {
              enabled: true, // Default: false
              runs: 200      // Default: 200
            },
          }
        }
      } 
};
