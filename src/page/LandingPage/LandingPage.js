import React, { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import { Row, Col, Container, Spinner } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";
import ReactPaginate from "react-paginate"

const LandingPage = ({ navSearchQuery, setNavSearchQuery }) => {
  const dispatch = useDispatch();

  // const productList = useSelector((state) => state.product.productList || []);
  const { productList, totalPageNum } = useSelector((state) => state.product);
  const [loading, setLoading] = useState(true);
  const [query] = useSearchParams();
  const name = query.get("name");

  const navigate = useNavigate();

  // useEffect(() => {
  //   dispatch(
  //     getProductList({
  //       name,
  //     })
  //   );
  // }, [query]);

  //상품리스트 가져오기 (url쿼리 맞춰서)
  useEffect(() => {
    setLoading(true);
    dispatch(getProductList({ ...navSearchQuery })).then(() => {
      setLoading(false);
    });
  }, [query, dispatch, navSearchQuery])

  useEffect(() => {
    //검색어나 페이지가 바뀌면 url바꿔주기 (검색어또는 페이지가 바뀜 => url 바꿔줌=> url쿼리 읽어옴=> 이 쿼리값 맞춰서  상품리스트 가져오기)
    if (navSearchQuery.name === "") {
      delete navSearchQuery.name
    }
    const params = new URLSearchParams(navSearchQuery) // 객체를 쿼리 형태로 바꿔준다. 
    const query = params.toString()
   
    navigate("?" + query)
  }, [navSearchQuery]);

  const handlePageClick = ({ selected }) => {
    //  쿼리에 페이지값 바꿔주기
    setNavSearchQuery({ ...navSearchQuery, page: selected + 1 })
  };

  return (
    <Container>
      <Row>
        {loading? (
          // 로딩 상태일 때 스피너 표시
          <div className="text-align-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : productList.length > 0 ? (
          productList.map((item) => (
            <Col md={3} sm={12} key={item._id}>
              <ProductCard item={item} />
            </Col>
          ))
        ) : (
          <div className="text-align-center empty-bag">
            {name === "" ? (
              <h2>등록된 상품이 없습니다!</h2>
            ) : (
              <h2>{name}과 일치한 상품이 없습니다!`</h2>
            )}
          </div>
        )}
  
      </Row>
      <ReactPaginate
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={totalPageNum}       //전체 페이지 수 
        forcePage={navSearchQuery.page - 1}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        className="display-center list-style-none"
      />
    </Container>
  );
};

export default LandingPage;
