import {
  Body,
  Container,
  Column,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

const logoUrl =
  "https://res.cloudinary.com/dl7zgwx4o/image/upload/v1734591091/z329nc2hyemqudonxc6m.jpg";

// Sample test data
const sampleOrderDetails = [
  {
    title: "Premium UI Kit",
    price: 49.99,
    category: "Templates",
    quantity: 2,
    imageUrl: "https://res.cloudinary.com/dl7zgwx4o/image/upload/v1710425607/uikit.png",
    productUrl: "https://example.com/download/uikit",
    totalPrice: 99.98
  },
  {
    title: "Icon Pack Pro",
    price: 19.99,
    category: "Graphics",
    quantity: 1,
    imageUrl: "https://res.cloudinary.com/dl7zgwx4o/image/upload/v1710425607/icons.png",
    productUrl: "https://example.com/download/icons",
    totalPrice: 19.99
  },
  {
    title: "Website Template Bundle",
    price: 79.99,
    category: "Templates",
    quantity: 1,
    imageUrl: "https://res.cloudinary.com/dl7zgwx4o/image/upload/v1710425607/template.png",
    productUrl: "https://example.com/download/template",
    totalPrice: 79.99
  }
];

const sampleTotalAmount = 199.96;

// For testing, you can use these props directly
export const EmailOrder = ({ 
  orderDetails = sampleOrderDetails, 
  totalAmount = sampleTotalAmount 
}) => {
  return (
    <Html>
      <Head />
      <Preview>Your SellBetter Order Confirmation</Preview>
      <Body style={{
        backgroundColor: "#ffffff",
        fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
      }}>
        <Container style={{
          margin: "0 auto",
          padding: "24px",
          maxWidth: "600px",
        }}>
          {/* Header Section */}
          <Section style={{ padding: "0 0 32px", display: "flex", justifyContent: "center" }}>
    <Img
        src={logoUrl}
        width="108"
        height="40"
        alt="SellBetter"
        style={{ borderRadius: "4px" }}
    />
</Section>

          <Section style={{ textAlign: "center", padding: "0 0 16px" }}>
            <Text style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#1a1a1a",
              margin: "0 0 8px",
            }}>Thanks for your purchase!</Text>
            <Text style={{
              fontSize: "16px",
              color: "#666666",
              margin: "0",
            }}>Here's what you ordered:</Text>
          </Section>

          <Hr style={{ borderColor: "#e6e6e6", margin: "16px 0" }} />

          {/* Order Items */}
          <Section style={{ padding: "0" }}>
            <Text style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1a1a1a",
              margin: "0 0 16px",
            }}>Order Details</Text>
            {Array.isArray(orderDetails) &&
              orderDetails.map((item, index) => (
                <Row key={index} style={{ margin: "0 0 16px" }}>
                  <Column style={{ width: "80px", verticalAlign: "top" }}>
                    {(item.imageUrl || item.image) && (
                      <Img
                        src={item.imageUrl || item.image}
                        width="80"
                        height="80"
                        alt={item.title || 'Product'}
                        style={{
                          borderRadius: "4px",
                          border: "1px solid #e6e6e6",
                        }}
                      />
                    )}
                  </Column>
                  <Column style={{ paddingLeft: "16px", width: "40%" }}>
                    <Text style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "#1a1a1a",
                      margin: "0 0 4px",
                    }}>{item.title}</Text>
                    <Text style={{
                      fontSize: "14px",
                      color: "#666666",
                      margin: "0 0 4px",
                    }}>{item.category || 'Uncategorized'}</Text>
                    
                    {/* Download Button with pink theme */}
                    {item.productUrl && (
                      <Text style={{
                        fontSize: "14px",
                        margin: "0",
                        padding: "0",
                      }}>
                        <Link
                          href={item.productUrl}
                          style={{
                            color: "#EE519F",
                            textDecoration: "none",
                            fontWeight: "500",
                          }}
                        >
                          Download Product
                        </Link>
                      </Text>
                    )}
                  </Column>
                  <Column style={{ textAlign: "right", verticalAlign: "top" }}>
                    {item.quantity > 1 && (
                      <Text style={{
                        fontSize: "14px",
                        color: "#666666",
                        margin: "0 0 4px",
                        textAlign: "right",
                      }}>Quantity: {item.quantity}</Text>
                    )}
                    <Text style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "#1a1a1a",
                      margin: "0",
                      textAlign: "right",
                    }}>
                      ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                    </Text>
                    {item.quantity > 1 && (
                      <Text style={{
                        fontSize: "14px",
                        color: "#666666",
                        margin: "4px 0 0",
                        textAlign: "right",
                      }}>
                        Total: ${(Number(item.price) * item.quantity).toFixed(2)}
                      </Text>
                    )}
                  </Column>
                </Row>
              ))}
          </Section>

          <Hr style={{ borderColor: "#e6e6e6", margin: "16px 0" }} />

          {/* Total Section */}
          <Section style={{ padding: "2px 0" }}>
            <Row>
              <Column style={{ width: "100%" }}>
                <Text style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#1a1a1a",
                  textAlign: "right",
                }}>
                  Total Amount: <span style={{ color: "#EE519F" }}>${Number(totalAmount).toFixed(2)}</span>
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={{ borderColor: "#e6e6e6", margin: "16px 0" }} />

         
          {/* Footer with link */}
          <Section style={{ padding: "4px  0" }}>
            <Text style={{
              fontSize: "12px",
              color: "#666666",
              textAlign: "center",
              marginBottom: "8px",
            }}>
              We're thrilled to have you with us! {''}
              <Link
                href="https://google.com" // For testing, change to your actual domain in production
                style={{
                  color: "#EE519F",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                SellBetter
              </Link>
              {''} to explore more.
            </Text>
            <Text style={{
              fontSize: "12px",
              color: "#666666",
              textAlign: "center",
            }}>© 2024 SellBetter. All rights reserved.</Text>
          </Section>

           {/* Contact Section */}
           <Section style={{
            padding: "16px 0",
            backgroundColor: "#f9f9f9",
            borderRadius: "4px",
            margin: "16px 0",
          }}>
            <Text style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#1a1a1a",
              margin: "0 0 8px",
              textAlign: "center",
            }}>Need Help?</Text>
            <Text style={{
              fontSize: "14px",
              color: "#666666",
              margin: "4px 0",
              textAlign: "center",
            }}>Email: support@sellbetter.com</Text>
            <Text style={{
              fontSize: "14px",
              color: "#666666",
              margin: "4px 0",
              textAlign: "center",
            }}>Phone: +91 7470527664</Text>
            {/* <Text style={{
              fontSize: "14px",
              color: "#666666",
              margin: "4px 0",
              textAlign: "center",
            }}>Hours: Monday - Friday, 9:00 AM - 6:00 PM EST</Text> */}
          </Section>


        </Container>
      </Body>
    </Html>
  );
};

// For direct testing
export const TestEmailOrder = () => (
  <EmailOrder orderDetails={sampleOrderDetails} totalAmount={sampleTotalAmount} />
);

export default EmailOrder;
