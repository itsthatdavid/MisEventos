#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create the miseventos_user if it doesn't exist
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'miseventos_user') THEN
            CREATE USER miseventos_user WITH PASSWORD 'miseventos123';
            RAISE NOTICE 'User miseventos_user created successfully';
        ELSE
            RAISE NOTICE 'User miseventos_user already exists';
        END IF;
    END
    \$\$;
    
    -- Grant privileges to the miseventos_user on the correct database
    GRANT ALL PRIVILEGES ON DATABASE miseventos_db TO miseventos_user;
    GRANT ALL ON SCHEMA public TO miseventos_user;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO miseventos_user;
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO miseventos_user;
    
    -- Ensure future tables also get the right permissions
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO miseventos_user;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO miseventos_user;
    
    -- Make miseventos_user a superuser for development
    ALTER USER miseventos_user WITH SUPERUSER;
    
    -- Log successful completion
    \echo 'Database initialization completed successfully'
EOSQL