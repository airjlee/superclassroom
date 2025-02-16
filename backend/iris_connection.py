import iris
import os

def get_connection():
    """
    Create and return a connection to the InterSystems IRIS database.
    Update host, port, namespace, and credentials as required.
    """
    username = "superclassroom"
    password = "treehacks2025"
    hostname = os.getenv("IRIS_HOSTNAME", "localhost")
    port = "1972"
    namespace = "USER"
    connection_string = f"{hostname}:{port}/{namespace}"
    
    try:
        conn = iris.connect(connection_string, username, password)
        return conn
    except Exception as e:
        print("Error connecting to IRIS:", e)
        raise