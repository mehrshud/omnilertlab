### 1. ADR for Omnilertlab Website
#### Status: Approved
#### Context: 
The Omnilertlab website is being rebuilt using TypeScript to improve maintainability and scalability. The development team has decided to use a microservices architecture to allow for easier updates and bug fixes. 
#### Decision: 
Use TypeScript with a microservices architecture and utilize a containerization tool such as Docker for deployment. The microservices will include separate services for user authentication, content management, and API connectivity.
#### Consequences: 
* The use of TypeScript will improve code quality and reduce errors.
* Microservices architecture will allow for easier maintenance and updates.
* Containerization with Docker will simplify deployment and improve scalability.
* Increased complexity may require additional training for development team.
* Potential for increased overhead due to the use of multiple services.